import { useSupabaseData } from "@/hooks/useSupabaseData";
import { topSkills } from "@/data/siteData";
import GradientText from "@/components/ui/GradientText";
import { motion, type Variants, useScroll, useTransform } from "framer-motion";
import maheenProfile from "@/assets/maheen-profile.jpg";
import { useRef } from "react";
const About = () => {
  const {
    data: aboutData,
    loading
  } = useSupabaseData<any>("about");
  const aboutInfo = aboutData.length > 0 ? aboutData[0] : null;
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Scroll-based animation for the image
  const {
    scrollYProgress
  } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.95]);
  const imageRotate = useTransform(scrollYProgress, [0, 1], [5, -5]);
  const containerVariants: Variants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };
  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };
  const skillVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.34, 1.56, 0.64, 1]
      }
    }
  };
  return <section id="about" ref={sectionRef} className="container py-16 md:py-24 relative">
      <motion.div className="grid lg:grid-cols-2 gap-16 items-center" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{
      once: true,
      margin: "-100px"
    }}>
        {/* Left Content */}
        <motion.div className="order-2 lg:order-1" variants={itemVariants}>
          <motion.div className="mb-8" variants={itemVariants}>
            <GradientText as="h2" className="text-3xl md:text-4xl lg:text-5xl font-display font-bold">
              {aboutInfo?.heading || "About Me"}
            </GradientText>
          </motion.div>

          <motion.div className="space-y-4 text-lg leading-relaxed text-muted-foreground/90" variants={itemVariants}>
            <p className="font-medium">
              {aboutInfo?.content || "Passionate AI engineer building the future with cutting-edge technology and innovative solutions."}
            </p>
            <p className="text-base">
              Currently pursuing BS in Artificial Intelligence at DUET, focusing
              on ethical AI development and real-world applications.
            </p>
          </motion.div>

          {/* Credentials highlight */}
          <motion.div className="mt-8 p-6 rounded-2xl bg-gradient-card border border-primary/20 backdrop-blur-sm" variants={itemVariants} whileHover={{
          scale: 1.02,
          borderColor: "hsl(var(--primary) / 0.4)"
        }} transition={{
          duration: 0.3
        }}>
            <h3 className="font-display font-semibold text-primary mb-3">
              Featured Work
            </h3>
            <p className="text-sm text-muted-foreground/80">
              🚀 30 AI Apps in 30 Days Challenge • 🎯 RAG & Agentic AI Specialist
              • 🎨 Creative AI Solutions
            </p>
          </motion.div>

          {/* Skills Tags */}
          <motion.div className="mt-8 flex flex-wrap gap-3" variants={containerVariants}>
            {topSkills.map((skill, index) => (
              <motion.span
                key={skill}
                className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20 hover:bg-primary/20 transition-colors"
                variants={skillVariants}
                custom={index}
              >
                {skill}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Side - Profile Image with Scroll Animation */}
        <motion.div className="order-1 lg:order-2 flex justify-center" variants={itemVariants}>
          <motion.div ref={imageRef} className="relative w-full max-w-sm" style={{
          y: imageY,
          scale: imageScale,
          rotateZ: imageRotate
        }}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
            <motion.img src={aboutInfo?.image_url || maheenProfile} alt="Maheen Touqeer" className="relative w-full h-auto rounded-3xl object-cover shadow-2xl border border-border/20" whileHover={{
            scale: 1.05
          }} transition={{
            duration: 0.3
          }} />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>;
};
export default About;