import React from "react";

const ContactInfo = () => {
  return (
    <div className="grid grid-cols-3 gap-[40px] mt-[50px]">
      <article className="text-center">
        <h3 className="text-[22px] font-semibold text-[#7A6F6F] mb-[20px]">
          Địa chỉ
        </h3>
        <div className="w-[251px] h-[1px] bg-black mx-auto mb-[20px]" />
        <p className="text-[16px]">
          97 Man Thiện, Phường Hiệp Phú, Q.9, TP.Hồ Chí Minh
        </p>
      </article>
      <article className="text-center">
        <h3 className="text-[22px] font-semibold text-[#7A6F6F] mb-[20px]">
          Số điện thoại
        </h3>
        <div className="w-[251px] h-[1px] bg-black mx-auto mb-[20px]" />
        <p className="text-[16px]">0123456789</p>
      </article>
      <article className="text-center">
        <h3 className="text-[22px] font-semibold text-[#7A6F6F] mb-[20px]">
          Mail
        </h3>
        <div className="w-[251px] h-[1px] bg-black mx-auto mb-[20px]" />
        <p className="text-[16px]">TanPND@gmail.com</p>
      </article>
    </div>
  );
};

export default ContactInfo;
