"use client";
import React from "react";
import ContactForm from "./ContactForm";
import ContactInfo from "./ContactInfo";
import Header from "../Homepage/Header";
import Footer from "../Homepage/Footer";

const ContactPage = () => {
  return (
    <main className="flex overflow-hidden flex-col bg-white">
      <Header />
      <section className="flex-1 bg-[#FDEEFF] m-[40px] p-[40px]">
        <h1 className="text-[36px] font-semibold tracking-[3.6px] text-center mb-[30px]">
          THÔNG TIN LIÊN HỆ
        </h1>
        <div className="text-center mb-[50px]">
          <p className="text-[22px] font-bold mb-[20px]">
            XIN CHÀO! CHÚNG TÔI CÓ THỂ GIÚP GÌ CHO BẠN?
          </p>
          <p className="text-[16px]">
            <span>
              Bạn có thắc mắc hay cần báo cáo vấn đề xảy ra với sản phẩm hoặc
              dịch vụ của{" "}
            </span>
            <span className="text-[#A81B8C]">Astro Số</span>
            <span>?</span>
            <br />
            <span>Chúng tôi luôn sẵn sàng hỗ trợ bạn.</span>
          </p>
        </div>
        <ContactForm />
        <ContactInfo />
      </section>
      <Footer />
    </main>
  );
};

export default ContactPage;
