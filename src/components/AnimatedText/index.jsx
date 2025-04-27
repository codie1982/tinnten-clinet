import { useEffect, useState } from "react";
/**
 * 
 * @       
 */
export default function AnimatedText() {
    const sentences = [
        "Yapay zekâ ile sınırları aşın",
        "Bilgiyi akışa dönüştürün",
        "Geleceğin ritmini yakalayın",
        "Akıllı çözümlerle fark yaratın",
        "Teknolojiyle güçlenin, akışta kalın",
        "Veriden ilhama, ilhamdan güce",
        "Dijital dünyayı aklınızla şekillendirin",
        "Yapay zekâ ile yeni ufuklara yelken açın",
        "Zekânızı geleceğe taşıyın",
        "Verinin ışığında ilerleyin",
        "Tinnten ile doğru bilgiye ulaşın",
        "Her adımda akıllı çözümler",
        "Yapay zekâ, gerçek dünyanın sihri",
        "Akışın ritmini yapay zekâ ile bulun",
        "Düşünün, öğrenin, ilerleyin",
        "Veriye yön verin, geleceği şekillendirin",
        "Yapay zekâ, aklın yeni sesi",
        "Gelecek akıllı olanlarla şekillenecek",
        "Teknolojiyi akılla birleştirin",
        "Gücünüzü yapay zekâ ile artırın"
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