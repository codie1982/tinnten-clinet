import { useEffect, useState } from "react";
/**
 * 
 * @       
 */
export default function AnimatedText() {
  const sentences = [
    "Bahçeme uygun sulama sistemi arıyorum",
    "Düğün organizasyonu için hizmet arıyorum",
    "Evime özel mobilya tasarımı yapan firma arıyorum",
    "Freelance yazılım desteği arıyorum",
    "Arabam için uygun kasko teklifi almak istiyorum",
    "Doğum günü partisi için catering hizmeti arıyorum",
    "Ev tadilatı için güvenilir usta bulmak istiyorum",
    "E-ticaret sitem için fotoğraf çekimi hizmeti arıyorum",
    "Uygun fiyatlı güvenlik kamerası sistemleri arıyorum",
    "Evime doğal gaz tesisatı için yetkili firma arıyorum",
    "Profesyonel çeviri hizmeti almak istiyorum",
    "Bebek fotoğrafçılığı yapan yerler arıyorum",
    "Logo tasarımı yaptırmak istiyorum",
    "Uygun fiyatlı temizlik hizmeti arıyorum",
    "Yoga dersleri için eğitmen bulmak istiyorum",
    "Şirketim için kurumsal kimlik tasarımı arıyorum",
    "İstanbul'da diyetisyen tavsiyesi arıyorum",
    "Telefonum için ekran değişimi yaptırabileceğim yer arıyorum",
    "Yurt dışı taşımacılık firması arıyorum",
    "Web sitesi için SEO hizmeti almak istiyorum"
  ];
  
  
      const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
      const [displayedWords, setDisplayedWords] = useState([]);
    
      useEffect(() => {
        const words = sentences[currentSentenceIndex].split(" ");
        setDisplayedWords([]);  // Önce ekranı temizle
    
        // timeout ID'lerini tutup cleanup'te iptal etmek için
        const timers = [];
    
        // i. kelimeden başlayarak sırayla gösterim fonksiyonu
        function showWord(i) {
          setDisplayedWords(prev => [...prev, words[i]]);
    
          if (i < words.length - 1) {
            // bir sonraki kelime için 300ms bekle
            timers.push(setTimeout(() => showWord(i + 1), 300));
          } else {
            // tüm kelimeler gösterildikten 2s sonra cümleyi değiştir
            timers.push(
              setTimeout(() => {
                setCurrentSentenceIndex(prev => (prev + 1) % sentences.length);
              }, 2000)
            );
          }
        }
    
        // Animasyona ilk kelimeyle hemen başla
        showWord(0);
    
        // Cleanup: component unmount veya currentSentenceIndex değiştiğinde tüm timeout'ları temizle
        return () => timers.forEach(t => clearTimeout(t));
      }, [currentSentenceIndex]);
  
      return (
        <div style={{ display: "flex", justifyContent: "start", alignItems: "center", height: "20vh" }}>
          <h1 style={{ fontSize: "48px", color: "#4f4f4f", textAlign: "center" }}>
            {displayedWords.map((word, i) => (
              <span
                key={i}
                style={{
                  opacity: 0,
                  animation: "fadeIn 0.5s forwards",
                  animationDelay: `${i * 0.1}s`,
                  marginRight: "8px"
                }}
              >
                {word}
              </span>
            ))}
          </h1>
          <style>{`
            @keyframes fadeIn {
              to { opacity: 1; }
            }
          `}</style>
        </div>
      );
  }