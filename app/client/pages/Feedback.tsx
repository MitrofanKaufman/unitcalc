// path: src/components/pages/Feedback.tsx
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MessageCircle,
  Send,
  Moon,
  Sun,
  Sparkles,
  User,
  AlertCircle,
  Bug,
  Lightbulb,
  HelpCircle,
  Frown,
  FileText,
  CheckCircle,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";

import { FeedbackForm } from "@/types/product.ts";

const Feedback = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FeedbackForm>({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: "question",
    priority: "medium",
  });

  useEffect(() => {
    // Check system preference
    const isDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const goBack = () => {
    navigate(-1);
  };

  const handleInputChange = (
    field: keyof FeedbackForm,
    value: string | FeedbackForm["type"] | FeedbackForm["priority"],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        type: "question",
        priority: "medium",
      });
    }, 3000);
  };

  const isFormValid = () => {
    return (
      formData.name.trim() &&
      formData.email.trim() &&
      formData.subject.trim() &&
      formData.message.trim()
    );
  };

  const feedbackTypes = [
    { value: "bug", label: "Сообщить о баге", icon: Bug },
    { value: "feature", label: "Предложить функцию", icon: Lightbulb },
    { value: "question", label: "Задать вопрос", icon: HelpCircle },
    { value: "complaint", label: "Жалоба", icon: Frown },
    { value: "other", label: "Другое", icon: FileText },
  ];

  const priorities = [
    { value: "low", label: "Низкий" },
    { value: "medium", label: "Средний" },
    { value: "high", label: "Высокий" },
  ];

  const getTypeIcon = (type: FeedbackForm["type"]) => {
    const typeData = feedbackTypes.find((t) => t.value === type);
    return typeData?.icon || HelpCircle;
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  if (isSubmitted) {
    return (
      <div
        className={`min-h-screen relative overflow-hidden ${isDark ? "bg-gradient-mobile-dark" : "bg-gradient-mobile-light"}`}
      >
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-gradient-primary opacity-20 blur-3xl floating"
            animate={{
              x: [0, 50, 0],
              y: [0, -25, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-secondary opacity-10 blur-3xl floating"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Success Message */}
        <div className="relative z-10 min-h-screen flex flex-col justify-center p-4 max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Card className="glass-card border-0 shadow-xl">
              <CardContent className="p-8">
                <motion.div
                  className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <CheckCircle className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Сообщение отправлено!
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Спасибо за ваше обращение. Мы свяжемся с вами в ближайшее
                  время.
                </p>
                <Button
                  onClick={goBack}
                  className="w-full h-12 bg-gradient-primary text-white"
                >
                  Вернуться назад
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${isDark ? "bg-gradient-mobile-dark" : "bg-gradient-mobile-light"}`}
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-gradient-primary opacity-20 blur-3xl floating"
          animate={{
            x: [0, 50, 0],
            y: [0, -25, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-gradient-accent opacity-15 blur-3xl floating"
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-secondary opacity-10 blur-3xl floating"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Theme Toggle */}
      <motion.button
        onClick={toggleTheme}
        className="absolute top-6 right-6 z-50 p-3 glass-button text-foreground"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-6"
      >
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={goBack}
            className="glass-button text-foreground hover:bg-white/10 rounded-full h-12 w-12"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">
            Обратная связь
          </h1>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-5 h-5 text-primary opacity-60" />
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-start pt-8 p-4 max-w-md mx-auto">
        <motion.div
          className="w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header Card */}
            <motion.div variants={itemVariants}>
              <Card className="glass-card border-0 shadow-xl">
                <CardHeader className="text-center relative p-6">
                  <motion.div
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${isDark ? "glass" : "neu"} flex items-center justify-center relative overflow-hidden`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className="absolute inset-0 bg-gradient-primary opacity-90 rounded-2xl" />
                    <MessageCircle className="w-8 h-8 text-white relative z-10" />
                  </motion.div>

                  <CardTitle className="text-xl font-bold text-foreground mb-3">
                    Свяжитесь с нами
                  </CardTitle>

                  <div className="text-sm text-muted-foreground mb-6">
                    Мы ценим ваше мнение и готовы помочь
                  </div>
                </CardHeader>
              </Card>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={itemVariants}>
              <Card className="glass-card border-0 shadow-xl">
                <CardContent className="p-6 space-y-6">
                  {/* Personal Info */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center relative">
                        <div className="absolute inset-0 rounded-lg border border-white/30" />
                        <User className="w-4 h-4 text-white relative z-10" />
                      </div>
                      <h4 className="text-lg font-semibold text-foreground">
                        Ваши данные
                      </h4>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-muted-foreground text-sm mb-3 block font-medium">
                          Имя
                        </Label>
                        <Input
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          placeholder="Введите ваше имя"
                          className={`h-12 text-sm ${isDark ? "glass border-white/20 text-white placeholder:text-white/60" : "neu border-gray-200"}`}
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-sm mb-3 block font-medium">
                          Email
                        </Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          placeholder="your@email.com"
                          className={`h-12 text-sm ${isDark ? "glass border-white/20 text-white placeholder:text-white/60" : "neu border-gray-200"}`}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Message Details */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-secondary rounded-lg flex items-center justify-center relative">
                        <div className="absolute inset-0 rounded-lg border border-white/30" />
                        <MessageCircle className="w-4 h-4 text-white relative z-10" />
                      </div>
                      <h4 className="text-lg font-semibold text-foreground">
                        Ваше сообщение
                      </h4>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-muted-foreground text-sm mb-3 block font-medium">
                            Тип обращения
                          </Label>
                          <Select
                            value={formData.type}
                            onValueChange={(value) =>
                              handleInputChange(
                                "type",
                                value as FeedbackForm["type"],
                              )
                            }
                          >
                            <SelectTrigger
                              className={`h-12 text-sm ${isDark ? "glass border-white/20 text-white" : "neu border-gray-200"}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent
                              className={`${isDark ? "glass-intense border-white/20" : "bg-white border-gray-200"}`}
                            >
                              {feedbackTypes.map((type) => (
                                <SelectItem
                                  key={type.value}
                                  value={type.value}
                                  className={`${isDark ? "text-white hover:bg-white/10" : "text-gray-900 hover:bg-gray-100"}`}
                                >
                                  <div className="flex items-center gap-2">
                                    <type.icon className="w-4 h-4" />
                                    {type.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-sm mb-3 block font-medium">
                            Приоритет
                          </Label>
                          <Select
                            value={formData.priority}
                            onValueChange={(value) =>
                              handleInputChange(
                                "priority",
                                value as FeedbackForm["priority"],
                              )
                            }
                          >
                            <SelectTrigger
                              className={`h-12 text-sm ${isDark ? "glass border-white/20 text-white" : "neu border-gray-200"}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent
                              className={`${isDark ? "glass-intense border-white/20" : "bg-white border-gray-200"}`}
                            >
                              {priorities.map((priority) => (
                                <SelectItem
                                  key={priority.value}
                                  value={priority.value}
                                  className={`${isDark ? "text-white hover:bg-white/10" : "text-gray-900 hover:bg-gray-100"}`}
                                >
                                  {priority.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label className="text-muted-foreground text-sm mb-3 block font-medium">
                          Тема сообщения
                        </Label>
                        <Input
                          value={formData.subject}
                          onChange={(e) =>
                            handleInputChange("subject", e.target.value)
                          }
                          placeholder="Кратко опишите суть обращения"
                          className={`h-12 text-sm ${isDark ? "glass border-white/20 text-white placeholder:text-white/60" : "neu border-gray-200"}`}
                          required
                        />
                      </div>

                      <div>
                        <Label className="text-muted-foreground text-sm mb-3 block font-medium">
                          Подробное описание
                        </Label>
                        <Textarea
                          value={formData.message}
                          onChange={(e) =>
                            handleInputChange("message", e.target.value)
                          }
                          placeholder="Подробно опишите ваш вопрос, п��облему или предложение..."
                          rows={5}
                          className={`text-sm resize-none ${isDark ? "glass border-white/20 text-white placeholder:text-white/60" : "neu border-gray-200"}`}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={!isFormValid() || isSubmitting}
                    className={`w-full h-12 text-base font-semibold border-0 shadow-lg transition-all duration-200 group ${
                      isDark
                        ? "glass text-white hover:bg-white/10"
                        : "neu-button bg-gradient-primary text-white hover:shadow-xl"
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        Отправка...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Send className="w-5 h-5 mr-2 group-hover:translate-x-0.5 transition-transform duration-200" />
                        Отправить сообщение
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Info Card */}
            <motion.div variants={itemVariants}>
              <Card className="glass-card border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center relative">
                      <div className="absolute inset-0 rounded-lg border border-white/30" />
                      <AlertCircle className="w-4 h-4 text-white relative z-10" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground">
                      Время ответа
                    </h4>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>• Обычные вопросы - в течение 24 часов</p>
                    <p>• Технические проблемы - в течение 4 часов</p>
                    <p>• Критические ошибки - в течение 1 часа</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Feedback;
