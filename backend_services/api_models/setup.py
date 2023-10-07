from setuptools import setup, find_packages

setup(
    name='api_models',
    version='0.1.0',
    packages=find_packages(),
    install_requires=[
        'pydantic==2.3.0',
    ],
)
