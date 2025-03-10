import React from 'react'
import { Row, Col, Card, Button, Carousel, Accordion, Container } from 'react-bootstrap'

export default function PrivatePolicy() {
  return (
    <>
      <div className="page-inside">
        <div className="page-section">
          <h1 className="page-title page-content-center">TİNNTEN GİZLİLİK POLİTİKASI</h1>
        </div>
        <div className="page-section">
          <div className="page-description"><p>Son Güncelleme: 09/03/2024</p></div>
        </div>
        <div className="page-section">

          <div className="page-description">
            <p>Tinnten olarak, kullanıcılarımızın gizliliğine büyük önem veriyoruz. Bu Gizlilik Politikası, Tinnten internet sitesi ve hizmetleri (“Hizmetler”) kapsamında kişisel verilerinizi nasıl topladığımızı, işlediğimizi, sakladığımızı ve koruduğumuzu açıklar.</p>
            <p>Hizmetlerimizi kullanarak, bu Gizlilik Politikası’nda belirtilen uygulamaları kabul etmiş olursunuz.
            </p>
          </div>
          <h2 className='page-title'>1. Toplanan Veriler</h2>
          <p>Tinnten, hizmetleri sağlamak ve iyileştirmek için aşağıdaki türde verileri toplayabilir:</p>
          <h3 className="page-sub-title">1.1 Sağladığınız Bilgiler</h3>
          <div className="page-description">
            <ul>
              <li> Hesap Bilgileri: Adınız, e-posta adresiniz, telefon numaranız, profil bilgileriniz</li>
              <li> İçerik ve Etkileşimler: Tinnten’de paylaştığınız yorumlar, mesajlar, ürün/hizmet talepleriniz</li>
              <li> Ödeme Bilgileri: Ücretli hizmetleri kullanmanız durumunda fatura ve ödeme detayları (ödeme işlemleri üçüncü taraf ödeme sağlayıcıları tarafından yönetilir)</li>
            </ul>
          </div>


          <h3 className="page-sub-title">1.2 Otomatik Olarak Toplanan Bilgiler</h3>
          <div className="page-description">
            <ul>
              <li> Cihaz ve Kullanım Verileri: IP adresi, tarayıcı türü, işletim sistemi, cihaz bilgileri</li>
              <li>Çerezler ve Takip Teknolojileri: Kullanıcı deneyimini geliştirmek için web sitemiz çerezler kullanır. Çerezleri nasıl yöneteceğinizi [Çerez Politikamızda] bulabilirsiniz.</li>
              <li> Konum Bilgileri: Kullanıcı deneyimini geliştirmek ve bölgesel hizmetler sunmak için IP adresinizden yaklaşık konum bilgisi alabiliriz.</li>
            </ul>
          </div>


          <h3 className="page-sub-title">1.3 Üçüncü Taraflardan Alınan Veriler</h3>
          <div className="page-description">
            <ul>
              <li> Ortaklardan Gelen Bilgiler: Ödeme sağlayıcılar, reklam ağları, iş ortakları gibi üçüncü taraflardan Tinnten ile etkileşimlerinize dair bilgiler alabiliriz.</li>
            </ul>
          </div>

          <h3 className="page-sub-title">2.2 Yapamayacağınız Şeyler</h3>
          <div className="page-description">
            <p>Hizmetlerimizi yasa dışı, zararlı veya kötüye kullanım içeren faaliyetler için kullanamazsınız. Örneğin:</p>
            <ul>
              <li>Başkalarının haklarını ihlal etmek veya kötüye kullanmak,</li>
              <li> Tinnten’in sunduğu hizmetleri izinsiz kopyalamak, satmak veya dağıtmak,</li>
              <li> Platformun güvenliğini tehdit eden girişimlerde bulunmak,</li>
              <li> Otomatik veya programlı olarak veri çekmek (scraping) veya bot kullanmak,</li>
              <li> Tinnten’in sunduğu içerik ve verileri, rakip bir sistem geliştirmek için kullanmak.</li>
            </ul>
          </div>

          <h3 className="page-sub-title">2.3 Üçüncü Taraf Hizmetleri</h3>
          <div className="page-description">
            <p>Hizmetlerimiz, üçüncü taraf yazılımlar, ürünler veya hizmetler içerebilir. Bu hizmetler, kendi koşullarına tabidir ve Tinnten, üçüncü taraf hizmetlerinden sorumlu değildir.</p>
          </div>

          <h2 className="page-sub-title">3. İçerik Politikası</h2>
          <h3 className="page-sub-title">3.1 İçeriğiniz</h3>
          <div className="page-description">
            <p>Hizmetlere veri girebilir (“Girdi”) ve Tinnten’in sunduğu hizmetlerden çıktı alabilirsiniz (“Çıktı”). Girilen ve üretilen tüm içeriklerden siz sorumlusunuz. Tinnten’e sunduğunuz içeriğin yasalara uygun olduğunu beyan edersiniz.</p>
          </div>

          <h3 className="page-sub-title">3.2 İçerik Sahipliği</h3>
          <div className="page-description">
            <p>Siz ve Tinnten arasında olmak üzere:</p>
            <ul>
              <li>	Girdi üzerindeki haklarınızı korursunuz,</li>
              <li>	Çıktı üzerindeki haklarınız, yürürlükteki yasalara bağlıdır.</li>
            </ul>
            <p>Hizmetlerin doğası gereği, diğer kullanıcılar benzer çıktılar elde edebilir. Tinnten, diğer kullanıcıların içeriklerinden sorumlu değildir.</p>

          </div>


          <h2 className='page-title'>2. Verilerin Kullanımı</h2>
          <div className="page-description">
            <p>Toplanan veriler, aşağıdaki amaçlarla kullanılabilir:</p>
            <ul>
              <li>	Hizmet Sunumu: Tinnten’de hesap oluşturma, giriş yapma, firma ekleme, ürün ve hizmet arama gibi işlemleri sağlamak</li>
              <li>	Geliştirme ve Optimizasyon: Kullanıcı deneyimini iyileştirmek ve Tinnten hizmetlerini geliştirmek</li>
              <li>	Pazarlama ve İletişim: Kullanıcı talepleri doğrultusunda bilgilendirme yapmak, promosyonlar sunmak</li>
              <li>	Güvenlik ve Dolandırıcılığın Önlenmesi: Kötüye kullanımı tespit etmek ve hesap güvenliğini sağlamak</li>
              <li>	Yasal Yükümlülükler: Yasal talepleri yerine getirmek ve düzenleyici gerekliliklere uymak</li>
            </ul>
          </div>




          <h2 className="page-sub-title">3. Verilerin Paylaşımı </h2>
          <div className="page-description">
            <p>Tinnten, kişisel verilerinizi satmaz ve ticari amaçlarla üçüncü taraflara kiralamaz. Ancak aşağıdaki durumlarda paylaşım yapılabilir:</p>
            <ul>
              <li>	Hizmet Sağlayıcılar: Ödeme işlemcileri, barındırma sağlayıcıları, analitik firmalar</li>
              <li>	Yasal Gereklilikler: Mahkeme kararları, yasal talepler doğrultusunda</li>
              <li>	İş Transferleri: Şirket birleşmeleri, devralmalar veya varlık satışları durumunda</li>
            </ul>
          </div>

          <h2 className="page-sub-title">4. Verilerin Saklanması ve Güvenliği</h2>
          <div className="page-description">
            <ul>
              <li>	Veri Saklama Süresi: Kullanıcı hesabınız aktif olduğu sürece veya yasal yükümlülüklere uygun olarak verilerinizi saklıyoruz.</li>
              <li>	Güvenlik Önlemleri: Tinnten, kullanıcı verilerini şifreleme, erişim kontrolleri ve güvenlik duvarları ile korur.</li>
              <li>	Veri İhlalleri: Olası bir veri ihlali durumunda etkilenen kullanıcılara en kısa sürede bildirim yaparız.</li>
            </ul>
          </div>


          <h2 className="page-sub-title">5. Kullanıcı Hakları</h2>

          <div className="page-description">
            <p>Kullanıcılar, yürürlükteki veri koruma yasalarına uygun olarak aşağıdaki haklara sahiptir:</p>
            <ul>
              <li>	Bilgi Alma: Hangi kişisel verilerin işlendiğini öğrenme</li>
              <li>	Düzeltme: Yanlış veya eksik bilgileri güncelleme</li>
              <li>	Silme (Unutulma Hakkı): Tinnten’den hesaplarını ve verilerini silme talebinde bulunma.</li>
              <li>	İşleme İtiraz Etme: Belirli veri işleme faaliyetlerini reddetme.</li>
              <li>	Veri Taşınabilirliği: Verilerinizi yapılandırılmış bir formatta alma ve başka bir hizmete aktarma.</li>
            </ul>
            <p>Bu haklardan herhangi birini kullanmak için <a href="mailto:destek@tinnten.com">destek@tinnten.com</a> adresinden bizimle iletişime geçebilirsiniz. </p>
          </div>


          <h2 className="page-sub-title">6. Çerezler ve İzleme Teknolojileri</h2>
          <div className="page-description">
            <p>Tinnten, kullanıcı deneyimini geliştirmek için çerezler (cookies) ve benzeri takip teknolojilerini kullanır. Çerezleri yönetmek veya devre dışı bırakmak için tarayıcı ayarlarınızı değiştirebilirsiniz. Daha fazla bilgi için [Çerez Politikamızı] inceleyebilirsiniz.</p>
          </div>


          <h2 className="page-sub-title">7. Üçüncü Taraf Bağlantıları</h2>
          <div className="page-description">
            <p>Tinnten, üçüncü taraf web sitelerine veya hizmetlere bağlantılar içerebilir. Bu sitelerin gizlilik uygulamalarından Tinnten sorumlu değildir. Üçüncü taraf hizmetleri kullanmadan önce ilgili gizlilik politikalarını okumanızı öneririz.</p>
          </div>

          <h2 className="page-sub-title">7. Değişiklikler ve Güncellemeler</h2>
          <div className="page-description">
            <p>Tinnten, kullanım koşullarını zaman zaman güncelleyebilir. Eğer önemli değişiklikler yapılırsa, size e-posta veya uygulama içi bildirim ile haber verilecektir.</p>
          </div>


          <h2 className="page-sub-title">8. Uluslararası Veri Aktarımları</h2>
          <div className="page-description">
            <p>Tinnten, kullanıcı verilerini yasal düzenlemelere uygun olarak yurtiçi veya yurtdışındaki sunucularda saklayabilir ve işleyebilir. Avrupa Ekonomik Alanı’ndaki (EEA) kullanıcılar için GDPR uyumlu veri koruma önlemleri uygulanmaktadır.</p>
          </div>


          <h2 className="page-sub-title">9. Gizlilik Politikası Güncellemeleri</h2>
          <div className="page-description">
            <p>Bu Gizlilik Politikası zaman zaman güncellenebilir. Önemli değişiklikler olması durumunda, e-posta veya platform üzerinden bildirimde bulunacağız. En güncel versiyonu her zaman web sitemizden inceleyebilirsiniz.</p>
          </div>

          <h2 className="page-sub-title">10. İletişim Bilgileri</h2>
          <div className="page-description">
            <p>Herhangi bir soru veya talebiniz için bize ulaşabilirsiniz:</p>
          </div>
        </div>
      </div>
    </>
  )
}
