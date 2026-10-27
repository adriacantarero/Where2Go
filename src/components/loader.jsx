import { motion } from "motion/react";

export function Loader() {
    const transition = (x) => ({
        duration: 1,
        repeat: Infinity,
        repeatType: "loop",
        delay: x * 0.2,
        ease: "easeInOut",
    });

    const dotStyle = {
        width: "16px",
        height: "16px",
        borderRadius: "50%",
        backgroundColor: "#a3a3a3",
        border: "1px solid #d4d4d4",
    };

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                justifyContent: "center",
            }}
        >
            <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, 10, 0] }}
                transition={transition(0)}
                style={dotStyle}
            />
            <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, 10, 0] }}
                transition={transition(1)}
                style={dotStyle}
            />
            <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, 10, 0] }}
                transition={transition(2)}
                style={dotStyle}
            />
        </div>
    );
}
