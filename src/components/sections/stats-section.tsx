"use client";

import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import { motion, useInView } from "framer-motion";
import { siteInfo } from "@/data/site";

export function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (inView) setStart(true);
  }, [inView]);

  return (
    <section ref={ref} className="gradient-brand py-16 text-white" aria-label="Statistics">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 lg:grid-cols-4 lg:px-8">
        {siteInfo.stats.map((stat, i) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <p className="font-display text-4xl font-bold md:text-5xl">
              {start && (
                <CountUp
                  end={stat.value}
                  duration={2.5}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  separator=","
                />
              )}
            </p>
            <p className="mt-2 text-sm text-white/80 md:text-base">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
