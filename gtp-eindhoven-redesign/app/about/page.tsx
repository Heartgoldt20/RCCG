import { InnerCta, PageHero, Shell } from "../components/SiteChrome";

export default function About() {
  return <Shell>
    <PageHero visual="about" kicker="About GTP" title="One family. Many nations." text="A Christ-centred church in Eindhoven where people connect, belong, learn and grow."/>
    <section className="contentGrid aboutStory pad">
      <div>
        <p className="eyebrow">Who we are</p>
        <h2>A church family with room for you.</h2>
        <p className="aboutStatement">Different backgrounds. Different generations. One faith in Jesus Christ.</p>
      </div>
      <div>
        <p className="lead">Glory Tabernacle Parish is a multicultural parish of the Redeemed Christian Church of God in Eindhoven.</p>
        <p>We are a welcoming, Spirit-filled community where people come together to worship God, build genuine relationships and grow as followers of Jesus. Whether you are discovering faith, new to the city or looking for a church to call home, you are welcome among us.</p>
        <div className="aboutDetails">
          <article><small>Our mission</small><p>To raise lives that fulfil God&apos;s will and purpose on earth, while keeping heaven as our ultimate goal.</p></article>
          <article><small>Our vision</small><p>To pursue peace and holiness, inspired by Hebrews 12:14.</p></article>
        </div>
      </div>
    </section>
    <section className="values pad"><p className="eyebrow">What shapes us</p><div className="valueGrid"><Value n="01" title="Connect" text="We encounter God and build genuine relationships across cultures and generations."/><Value n="02" title="Belong" text="Everyone deserves a spiritual home where they are known, welcomed and valued."/><Value n="03" title="Learn" text="We grow through Scripture, prayer and the guidance of the Holy Spirit."/><Value n="04" title="Grow" text="Faith becomes visible as we serve, lead and live with purpose every day."/></div></section>
    <section className="pastors"><div className="portrait" role="img" aria-label="Leadership at Glory Tabernacle Parish"/><div className="pastorText"><p className="eyebrow pale">Our pastors</p><blockquote>Dennis &amp; Titilayo Shakka</blockquote><p>They serve with a deep passion for God, His Word and His people, committed to sharing God&apos;s unconditional love and nurturing spiritual growth in every believer.</p></div></section>
    <InnerCta/>
  </Shell>;
}

function Value({ n, title, text }: { n: string; title: string; text: string }) {
  return <article><span>{n}</span><h3>{title}</h3><p>{text}</p></article>;
}
