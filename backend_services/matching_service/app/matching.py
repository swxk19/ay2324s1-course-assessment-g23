import json
from fastapi import WebSocket
import aio_pika
import asyncio

# from matching_util import User, message_received
from matching_util import set_message_received

import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Configure logging to write to stdout
handler = logging.StreamHandler()
formatter = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)


async def send_user_to_queue(user_id, complexity):
    try:
        connection = await aio_pika.connect_robust("amqp://guest:guest@rabbitmq:5672/%2F")
        channel = await connection.channel()

        queue_name = f'{complexity}_queue'
        await channel.declare_queue(queue_name)
        message = {
            "action": "queue",
            "user_id": f"{user_id}",
            "complexity": f"{complexity}"
        }
        data = json.dumps(message)
        logger.info(f"{user_id} sent to queue")
        await channel.default_exchange.publish(
            aio_pika.Message(body=data.encode()),
            routing_key=queue_name,
        )

        return ''
    except Exception as e:
        logger.info(f"Error occurred: {str(e)}")
        return None


async def wait_for_match(user_id: str, complexity: str, websocket: WebSocket):
    try:
        connection = await aio_pika.connect_robust("amqp://guest:guest@rabbitmq:5672/%2F")
        channel = await connection.channel()

        # Declare a unique reply queue for this listener
        reply_queue_name = f'{user_id}_q'
        queue = await channel.declare_queue(reply_queue_name)
        consumer_tag = None

        async def on_response(message):
            nonlocal consumer_tag
            async with message.process():
                response_data = json.loads(message.body)
                user1_id = response_data["user1"]
                user2_id = response_data["user2"]
                if user1_id == user_id:
                    id = user2_id
                else:
                    id = user1_id
                logger.info(f"{id} has matched")
                # message = f"You have matched with {id}!"
                message = {
                    "is_matched": True,
                    "user_id": f"{id}"
                }
                await websocket.send_text(json.dumps(message))
                if consumer_tag is not None:
                    await queue.cancel(consumer_tag)
                set_message_received(user_id)

        logger.info(f"{user_id} waiting for response...")
        consumer_tag = await queue.consume(on_response)
        await asyncio.sleep(30)
        if consumer_tag is not None:
            logger.info(f"CANCELLING Consumer tag: {consumer_tag}")
            await queue.cancel(consumer_tag)
        raise asyncio.TimeoutError
    except asyncio.TimeoutError as e:
        logger.info("Time has exceeded 30 seconds")
        await remove_user_from_queue(user_id=user_id, complexity=complexity)
        message = {
            "is_matched": False,
            "user_id": None
        }
        try:
            await websocket.send_text(json.dumps(message))
        except:
            logger.info("WS disconnected")
    except Exception as e:
        logger.info(f"Error occurred: {str(e)}")
    finally:
        set_message_received(user_id)


async def remove_user_from_queue(user_id: str, complexity: str):
    try:
        connection = await aio_pika.connect_robust("amqp://guest:guest@rabbitmq:5672/%2F")
        channel = await connection.channel()

        queue_name = f'{complexity}_queue'
        await channel.declare_queue(queue_name)
        message = {
            "action": "cancel",
            "user_id": f"{user_id}",
            "complexity": f"{complexity}"
        }
        data = json.dumps(message)
        logger.info(f"{user_id} to be removed")
        await channel.default_exchange.publish(
            aio_pika.Message(body=data.encode()),
            routing_key=queue_name,
        )
        return ''
    except Exception as e:
        logger.info(f"Error occurred: {str(e)}")
        return None
