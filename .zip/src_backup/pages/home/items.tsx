import {motion} from "framer-motion";
import {itemVariants} from "@/core/types/itemVariants";
import React from "react";

<motion.div
    className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
variants={itemVariants}
    >
    {[
            { value: "100%", label: "Точность" },
{ value: "5 мин", label: "Экономия" },
{ value: "24/7", label: "Доступ" },
{ value: "0₽", label: "Бесплатно" },
].map((stat, index) => (
    <div key={index} className="p-4 rounded-xl neu">
<div className="text-2xl font-bold text-primary">{stat.value}</div>
    <div className="text-sm text-muted-foreground">{stat.label}</div>
    </div>
))}
</motion.div>