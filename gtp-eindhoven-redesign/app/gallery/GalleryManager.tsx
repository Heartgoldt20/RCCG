"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Moment = { title: string; copy: string; src: string; pos: string; category: string; key?: string; uploaded?: string };
const categories = ["All", "Worship", "Virtuous Women", "Children", "Youth", "Choir", "Baptism", "Child Dedication", "Community", "Celebrations"];

export default function GalleryArchive({ moments }: { moments: Moment[] }) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<number | null>(null);
  const visible = useMemo(() => {
    const search = query.trim().toLowerCase();
    return moments.filter(photo => (category === "All" || photo.category === category) && (!search || `${photo.title} ${photo.copy} ${photo.category}`.toLowerCase().includes(search)));
  }, [moments, category, query]);
  const close = useCallback(() => setActive(null), []);
  const previous = useCallback(() => setActive(value => value === null ? null : (value - 1 + visible.length) % visible.length), [visible.length]);
  const next = useCallback(() => setActive(value => value === null ? null : (value + 1) % visible.length), [visible.length]);

  useEffect(() => {
    if (active === null) return;
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
    };
    document.body.classList.add("lightboxOpen");
    window.addEventListener("keydown", key);
    return () => {
      document.body.classList.remove("lightboxOpen");
      window.removeEventListener("keydown", key);
    };
  }, [active, close, next, previous]);
  useEffect(() => setActive(null), [category, query]);

  const current = active === null ? null : visible[active];
  return <>
    <section className="galleryArchive pad" aria-label="Church photo gallery">
      <div className="galleryTools"><div className="filterBar" aria-label="Filter photos by category">{categories.map(item => <button key={item} type="button" className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div><label className="gallerySearch"><span className="srOnly">Search photos</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search photos…"/><b aria-hidden="true">⌕</b></label></div>
      <div className="galleryCount"><span>{visible.length} {visible.length === 1 ? "photo" : "photos"}</span><small>Select a photo to open</small></div>
      {visible.length ? <div className="photoGrid">{visible.map((photo, index) => <button className="photoTile" key={photo.key || photo.src} type="button" onClick={() => setActive(index)} aria-label={`Open ${photo.title}`}><img src={photo.src} alt={photo.title} loading="lazy"/><span><b>{photo.title}</b><small>{photo.category}</small></span></button>)}</div> : <div className="galleryEmpty"><h3>No photos found.</h3><p>Try another category or search term.</p></div>}
    </section>
    {current && <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${current.title}, photo ${active! + 1} of ${visible.length}`} onClick={close}><button className="lightboxClose" type="button" onClick={close} aria-label="Close photo viewer">Close</button><button className="lightboxNav lightboxPrev" type="button" onClick={event => { event.stopPropagation(); previous(); }} aria-label="Previous photo">Previous</button><div className="lightboxStage" onClick={event => event.stopPropagation()}><img src={current.src} alt={current.title}/><div className="lightboxCaption"><div><strong>{current.title}</strong><span>{current.copy}</span></div><small>{active! + 1} / {visible.length} · {current.category}</small></div></div><button className="lightboxNav lightboxNext" type="button" onClick={event => { event.stopPropagation(); next(); }} aria-label="Next photo">Next</button></div>}
  </>;
}
