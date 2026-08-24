import{InnerCta,PageHero,Shell}from"../components/SiteChrome";
import GalleryArchive from"./GalleryManager";

const moments=[
{title:"Worshipping together",copy:"Joyful praise and wholehearted worship every Sunday.",src:"/gallery-worship.webp",pos:"50% 22%",category:"Worship"},
{title:"Growing in the Word",copy:"Practical teaching rooted in Scripture for every generation.",src:"/gallery-word.webp",pos:"50% 25%",category:"Worship"},
{title:"Serving with love",copy:"Using our gifts to welcome, encourage and care for one another.",src:"/gallery-welcome.webp",pos:"50% 20%",category:"Community"},
{title:"Building community",copy:"Friendship and fellowship that continue beyond Sunday.",src:"/gallery-learning.webp",pos:"50% 28%",category:"Community"},
{title:"Raising generations",copy:"A safe place for children and young people to know God.",src:"/gallery-children.webp",pos:"50% 20%",category:"Children"},
{title:"Celebrating life",copy:"Honouring milestones, testimonies and God’s faithfulness.",src:"/gallery-event.webp",pos:"50% 50%",category:"Celebrations"},
{title:"Women of faith",copy:"Growing stronger together in faith and friendship.",src:"/archive-women.webp",pos:"50% 30%",category:"Virtuous Women"},
{title:"New life",copy:"Celebrating baptism and a public declaration of faith.",src:"/archive-baptism3.webp",pos:"50% 50%",category:"Baptism"},
{title:"A joyful dedication",copy:"Families entrusting the next generation to God.",src:"/archive-dedication.webp",pos:"50% 45%",category:"Child Dedication"},
{title:"Young and connected",copy:"A generation discovering purpose, belonging and faith.",src:"/archive-yt3.webp",pos:"50% 45%",category:"Youth"},
{title:"Praise from the heart",copy:"Lifting one voice in worship.",src:"/archive-mu2.webp",pos:"50% 28%",category:"Choir"},
{title:"Ready to welcome",copy:"Serving every guest with warmth and care.",src:"/archive-usher.webp",pos:"50% 25%",category:"Community"},
{title:"Children in church",copy:"Learning, laughing and growing in God’s love.",src:"/archive-chld1.webp",pos:"50% 28%",category:"Children"},
{title:"Precious moments",copy:"Making church a place every child can call home.",src:"/archive-chld2.webp",pos:"50% 22%",category:"Children"},
{title:"Baptism celebration",copy:"A beautiful milestone shared with the church family.",src:"/archive-baptism.webp",pos:"50% 30%",category:"Baptism"},
{title:"Together in faith",copy:"Standing with one another through every season.",src:"/archive-dedication03.webp",pos:"50% 30%",category:"Child Dedication"},
{title:"One sound",copy:"Our choir leading the church in praise.",src:"/archive-mu4.webp",pos:"50% 24%",category:"Choir"},
{title:"A new beginning",copy:"Faith made visible through baptism.",src:"/archive-baptism2.webp",pos:"50% 32%",category:"Baptism"}
];

export default function Gallery(){return <Shell><PageHero visual="gallery" kicker="Life together" title="Moments from our church family." text="Worship, fellowship, learning and celebration at Glory Tabernacle Parish."/><section className="galleryIntro pad"><p className="eyebrow">More than a gathering</p><h2>Church is family.</h2><p>Browse every moment, filter by ministry or search the collection. Select any photo to open it full-screen and move through the complete gallery.</p></section><GalleryArchive moments={moments}/><InnerCta/></Shell>}
