import React from "react";

export const ArticlesSection = () => {
  return (
    <section>
      <h2 className="flex flex-col justify-center py-12 w-full text-4xl font-semibold leading-none text-center text-purple-600 border border-black border-solid bg-neutral-700 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] tracking-[3.4px] max-md:max-w-full">
        <div className="py-14 pr-16 pl-28 w-full bg-neutral-950 max-md:px-5 max-md:max-w-full">
          BÀI VIẾT MỚI NHẤT
        </div>
      </h2>

      <div className="self-center mt-10 px-10 w-full max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <article className="w-[33%] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col grow px-6 py-5 w-full text-base font-semibold tracking-widest leading-6 text-white bg-black max-md:px-5 max-md:mt-10">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/4bbe55cb933948daa0534ee19f05058f/ba152191156278529ef59e4ca4e8632b70b76a4d?placeholderIfAbsent=true"
                alt="Article thumbnail"
                className="object-contain w-full aspect-[1.5]"
              />
              <h3 className="mt-3">
                BẢN ĐỒ THẦN SỐ HỌC LÀ GÌ? HƯỚNG DẪN CHI TIẾT & HƯỚNG DẪN
              </h3>
            </div>
          </article>

          <article className=" w-[33%] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col grow px-6 py-5 w-full text-base font-semibold tracking-widest leading-6 text-white bg-black max-md:px-5 max-md:mt-10">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/4bbe55cb933948daa0534ee19f05058f/fb3601ca17020ea58fe5bd5925e71dc5a2ff6501?placeholderIfAbsent=true"
                alt="Article thumbnail"
                className="object-contain w-full aspect-[1.5]"
              />
              <h3 className="mt-3">
                THẦN SỐ HỌC LÀ GÌ? CÙNG NHAU TÌM HIỂU VỀ THẦN SỐ HỌC.
              </h3>
            </div>
          </article>

          <article className=" w-[33%] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col grow px-6 py-5 w-full text-base font-semibold tracking-widest leading-6 text-white bg-black max-md:px-5 max-md:mt-10">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/4bbe55cb933948daa0534ee19f05058f/e719646c03e2acd2901a3e32fb0c0dcb274f138d?placeholderIfAbsent=true"
                alt="Article thumbnail"
                className="object-contain w-full aspect-[1.5]"
              />
              <h3 className="mt-3">
                THẦN SỐ HỌC SỐ 5: CON SỐ CỦA NGƯỜI THÍCH TỰ DO & THÁM HIỂM
              </h3>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};
