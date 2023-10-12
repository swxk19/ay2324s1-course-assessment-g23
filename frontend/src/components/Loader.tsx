import { motion } from "framer-motion";

/** Adapted from https://codesandbox.io/s/framer-motion-loader-tpbpg?file=/src/loader.jsx */

const colors = ["#00b8a2", "#33c575", "#66d248", "#99de1b", "#fec800", "#fe9c40", "#fe7030", "#fe4430", "#fe375f"];

const containerVariants = {
    initial: {},
    animate: {
        transition: {
            when: "beforeChildren",
            staggerChildren: 0.1
        }
    }
};

const dotVariants = {
    initial: {},
    animate: {
        height: [40, 100, 40],
        transition: {
            duration: 1.5,
            repeat: Infinity
        }
    }
};

const Loader = ({ count = colors.length }) => {
    return (
        <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            style={{
                display: "flex",
                gap: 10,
                height: 100,
                alignItems: "center"
            }}
        >
            {Array(count)
                .fill(null)
                .map((_, index) => {
                    return (
                        <motion.div
                            key={index}
                            variants={dotVariants}
                            style={{
                                height: 40,
                                width: 40,
                                backgroundColor: colors[index % colors.length],
                                borderRadius: 20
                            }}
                        />
                    );
                })}
        </motion.div>
    );
};

export default Loader;
