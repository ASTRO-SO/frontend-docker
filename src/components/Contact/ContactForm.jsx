"use client";
import React, { useState } from "react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      formData.name &&
      formData.email &&
      formData.subject &&
      formData.message
    ) {
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (submitted) {
    return (
      <div className="text-center text-[20px] text-[#A81B8C] font-semibold">
        Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-[20px]">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Họ và tên"
            className="p-[15px] rounded-[4px] border-[1px] border-[#A81B8C] bg-white"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="p-[15px] rounded-[4px] border-[1px] border-[#A81B8C] bg-white"
          />
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Chủ đề"
            className="p-[15px] rounded-[4px] border-[1px] border-[#A81B8C] bg-white"
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Nội dung"
            className="p-[15px] rounded-[4px] border-[1px] border-[#A81B8C] bg-white h-[200px]"
          />
          <button
            type="submit"
            className="bg-[#A81B8C] text-white py-[15px] px-[30px] rounded-[4px] font-semibold self-center"
          >
            Gửi tin nhắn
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
