import React, { useState } from "react";
import '../style/BantuanStyle.css'
import faqImage from '../assets/img/image_bantuan.png';

const faqs = [
  {
    question: "Bagaimana cara memesan produk?",
    answer: "Anda bisa memesan produk dengan menambahkannya ke keranjang dan melakukan checkout.",
  },
  {
    question: "Bagaimana cara melakukan pembayaran?",
    answer: "Pembayaran dapat dilakukan melalui transfer bank atau metode lain yang tersedia di website.",
  },
  {
    question: "Bagaimana cara mengatur ulang password akun?",
    answer: "Klik 'Lupa Password' di halaman login dan ikuti langkah-langkahnya.",
  },
  {
    question: "Bagaimana cara mengemas paket untuk dikembalikan ke penjual?",
    answer: "Pastikan paket dalam kondisi baik, lalu hubungi penjual untuk petunjuk lebih lanjut.",
  },
  {
    question: "Apakah katalog di website sama seperti di offline store?",
    answer: "Katalog di website bisa berbeda dengan offline store karena stok bisa berubah sewaktu-waktu.",
  },
  {
    question: "Bagaimana cara konsultasi ke penjual?",
    answer: "Anda bisa menghubungi penjual melalui WhatsApp atau fitur chat yang tersedia di website.",
  },
];

const Bantuan = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h1 className="faq-title">FAQ</h1>
      <div className="faq-content">
        <div className="faq-image">
          <img src={faqImage} alt="FAQ Illustration" />
        </div>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <div className="faq-question" onClick={() => toggleFAQ(index)}>
                {faq.question}
                <button className="toggle-button">
                  {openIndex === index ? "−" : "+"}
                </button>
              </div>
              {openIndex === index && (
                <div className="faq-answer">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bantuan;
