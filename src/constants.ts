import { LoveStoryState } from "./types";

// Beautiful, fairytale-themed ornate frame asset, custom-designed to match the pink and gold love story theme
export const FRAME_ASSET = "data:image/svg+xml;utf8," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 664 960" width="100%" height="100%">
  <defs>
    <!-- Fairytale Magical Pink Gradient -->
    <linearGradient id="fairy-pink" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF0F3" />
      <stop offset="30%" stop-color="#F472B6" />
      <stop offset="70%" stop-color="#EC4899" />
      <stop offset="100%" stop-color="#BE185D" />
    </linearGradient>
    
    <!-- Fairytale Celestial Gold Gradient -->
    <linearGradient id="fairy-gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF3C7" />
      <stop offset="30%" stop-color="#FBBF24" />
      <stop offset="70%" stop-color="#D97706" />
      <stop offset="100%" stop-color="#78350F" />
    </linearGradient>
    
    <!-- Cozy Fairytale Shimmer Highlight -->
    <linearGradient id="fairy-shimmer" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="50%" stop-color="#FFE4E6" />
      <stop offset="100%" stop-color="#FBCFE8" />
    </linearGradient>

    <!-- Reusable Magical Heart -->
    <g id="fairy-heart">
      <path d="M 0 5 C -3 -1, -9 -1, -9 5 C -9 11, 0 19, 0 19 C 0 19, 9 11, 9 5 C 9 -1, 3 -1, 0 5 Z" fill="url(#fairy-pink)" stroke="#4E2512" stroke-width="2.5" stroke-linejoin="round" />
    </g>

    <!-- Reusable 4-Point Magic Twinkle Star -->
    <g id="magic-star">
      <path d="M 0 -10 Q 0 0 -10 0 Q 0 0 0 10 Q 0 0 10 0 Q 0 0 0 -10 Z" fill="url(#fairy-gold)" stroke="#4E2512" stroke-width="2" stroke-linejoin="round" />
    </g>

    <!-- Reusable Miniature Fairytale Rose -->
    <g id="fairy-rose">
      <circle cx="0" cy="0" r="7" fill="url(#fairy-pink)" stroke="#4E2512" stroke-width="2" />
      <path d="M -5 -2 C -1 -5, 1 -5, 5 -2" fill="none" stroke="#4E2512" stroke-width="1.8" stroke-linecap="round" />
      <path d="M -3 2 C 0 4, 1 4, 3 2" fill="none" stroke="#4E2512" stroke-width="1.8" stroke-linecap="round" />
      <circle cx="0" cy="0" r="2.5" fill="#FEF3C7" />
    </g>
  </defs>

  <!-- Outer Theme Outlines & Bevel Borders in theme chocolate brown (#4E2512) and warm gold -->
  <rect x="8" y="8" width="648" height="944" rx="14" fill="none" stroke="#4E2512" stroke-width="6" />
  <rect x="14" y="14" width="636" height="932" rx="12" fill="none" stroke="url(#fairy-gold)" stroke-width="10" />
  <rect x="24" y="24" width="616" height="912" rx="8" fill="none" stroke="#4E2512" stroke-width="3" />

  <!-- Beaded inner magical ribbon border (pink & white dash) -->
  <rect x="30" y="30" width="604" height="900" rx="6" fill="none" stroke="url(#fairy-shimmer)" stroke-width="2" stroke-dasharray="10 8" />

  <!-- Inner border liner aligned with theme layout -->
  <rect x="38" y="38" width="588" height="884" fill="none" stroke="#4E2512" stroke-width="10" />
  <rect x="48" y="48" width="568" height="864" fill="none" stroke="url(#fairy-gold)" stroke-width="4" />

  <!-- Elegant Curling Leaf Vines in Corners -->
  <g stroke="#4E2512" stroke-width="2.5" fill="none" stroke-linecap="round">
    <!-- Top Left Vine -->
    <path d="M 28 80 C 40 80, 80 40, 80 28" />
    <path d="M 38 90 C 52 90, 90 52, 90 38" />
    <!-- Top Right Vine -->
    <path d="M 636 80 C 624 80, 584 40, 584 28" />
    <path d="M 626 90 C 612 90, 574 52, 574 38" />
    <!-- Bottom Left Vine -->
    <path d="M 28 880 C 40 880, 80 920, 80 932" />
    <path d="M 38 870 C 52 870, 90 908, 90 922" />
    <!-- Bottom Right Vine -->
    <path d="M 636 880 C 624 880, 584 920, 584 932" />
    <path d="M 626 870 C 612 870, 574 908, 574 922" />
  </g>

  <!-- Small Delicate Golden Leaves on the Corner Vines -->
  <g fill="url(#fairy-gold)" stroke="#4E2512" stroke-width="2" stroke-linejoin="round">
    <!-- Top Left Leaves -->
    <path d="M 52 64 C 48 58, 40 58, 44 64 C 48 70, 56 70, 52 64 Z" />
    <path d="M 76 40 C 72 34, 64 34, 68 40 C 72 46, 80 46, 76 40 Z" />
    <!-- Top Right Leaves -->
    <path d="M 612 64 C 616 58, 624 58, 620 64 C 616 70, 608 70, 612 64 Z" />
    <path d="M 588 40 C 592 34, 600 34, 596 40 C 592 46, 584 46, 588 40 Z" />
    <!-- Bottom Left Leaves -->
    <path d="M 52 896 C 48 902, 40 902, 44 896 C 48 890, 56 890, 52 896 Z" />
    <path d="M 76 920 C 72 926, 64 926, 68 920 C 72 914, 80 914, 76 920 Z" />
    <!-- Bottom Right Leaves -->
    <path d="M 612 896 C 616 902, 624 902, 620 896 C 616 890, 608 890, 612 896 Z" />
    <path d="M 588 920 C 592 926, 600 926, 596 920 C 592 914, 584 914, 588 920 Z" />
  </g>

  <!-- Interactive/Themed Corner Icons: Love Hearts in exact theme pink -->
  <use href="#fairy-heart" x="0" y="0" transform="translate(64, 64) scale(1.4)" />
  <use href="#fairy-heart" x="0" y="0" transform="translate(600, 64) scale(1.4)" />
  <use href="#fairy-heart" x="0" y="0" transform="translate(64, 896) scale(1.4)" />
  <use href="#fairy-heart" x="0" y="0" transform="translate(600, 896) scale(1.4)" />

  <!-- Twinkling Magic Sparkle Stars bordering the picture frame -->
  <use href="#magic-star" x="0" y="0" transform="translate(105, 64) scale(0.9)" />
  <use href="#magic-star" x="0" y="0" transform="translate(559, 64) scale(0.9)" />
  <use href="#magic-star" x="0" y="0" transform="translate(105, 896) scale(0.9)" />
  <use href="#magic-star" x="0" y="0" transform="translate(559, 896) scale(0.9)" />
  
  <use href="#magic-star" x="0" y="0" transform="translate(42, 480) scale(1.1)" />
  <use href="#magic-star" x="0" y="0" transform="translate(622, 480) scale(1.1)" />
  <use href="#magic-star" x="0" y="0" transform="translate(332, 28) scale(1.2)" />
  <use href="#magic-star" x="0" y="0" transform="translate(332, 932) scale(1.2)" />

  <!-- Miniature Themed Fairytale Roses along the top and bottom borders -->
  <use href="#fairy-rose" x="0" y="0" transform="translate(210, 26) scale(1.2)" />
  <use href="#fairy-rose" x="0" y="0" transform="translate(454, 26) scale(1.2)" />
  <use href="#fairy-rose" x="0" y="0" transform="translate(210, 934) scale(1.2)" />
  <use href="#fairy-rose" x="0" y="0" transform="translate(454, 934) scale(1.2)" />
</svg>
`);

// Beautiful Forest Emerald Vine & Blossom Pink Floral Frame
export const FRAME_ASSET_VINE = "data:image/svg+xml;utf8," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 664 960" width="100%" height="100%">
  <defs>
    <linearGradient id="vine-green" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ECFDF5" />
      <stop offset="30%" stop-color="#34D399" />
      <stop offset="70%" stop-color="#059669" />
      <stop offset="100%" stop-color="#064E3B" />
    </linearGradient>
    <linearGradient id="blossom-pink" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF1F2" />
      <stop offset="50%" stop-color="#FDA4AF" />
      <stop offset="100%" stop-color="#E11D48" />
    </linearGradient>
    <linearGradient id="warm-gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF3C7" />
      <stop offset="50%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#78350F" />
    </linearGradient>
    <g id="vine-leaf">
      <path d="M 0 -10 Q 6 -6, 0 10 Q -6 -6, 0 -10 Z" fill="url(#vine-green)" stroke="#064E3B" stroke-width="2"/>
    </g>
    <g id="vine-flower">
      <circle cx="0" cy="0" r="8" fill="url(#blossom-pink)" stroke="#4E2512" stroke-width="2" />
      <path d="M -5 -5 C -1 -8, 1 -8, 5 -5" fill="none" stroke="#4E2512" stroke-width="1.5" />
      <circle cx="0" cy="0" r="3" fill="#FBBF24" />
    </g>
  </defs>
  <rect x="8" y="8" width="648" height="944" rx="14" fill="none" stroke="#064E3B" stroke-width="6" />
  <rect x="14" y="14" width="636" height="932" rx="12" fill="none" stroke="url(#warm-gold)" stroke-width="8" />
  <rect x="22" y="22" width="620" height="916" rx="8" fill="none" stroke="#064E3B" stroke-width="2.5" />
  <rect x="36" y="36" width="592" height="888" fill="none" stroke="#10B981" stroke-width="6" />
  <rect x="42" y="42" width="580" height="876" fill="none" stroke="#064E3B" stroke-width="4" />
  <g stroke="#064E3B" stroke-width="3" fill="none" stroke-linecap="round">
    <path d="M 30 80 Q 80 80 80 30" />
    <path d="M 634 80 Q 584 80 584 30" />
    <path d="M 30 880 Q 80 880 80 930" />
    <path d="M 634 880 Q 584 880 584 930" />
  </g>
  <g transform="translate(65, 65) scale(1.4)">
    <use href="#vine-leaf" x="0" y="0" transform="rotate(45)" />
    <use href="#vine-flower" x="0" y="0" />
  </g>
  <g transform="translate(599, 65) scale(1.4)">
    <use href="#vine-leaf" x="0" y="0" transform="rotate(-45)" />
    <use href="#vine-flower" x="0" y="0" />
  </g>
  <g transform="translate(65, 895) scale(1.4)">
    <use href="#vine-leaf" x="0" y="0" transform="rotate(135)" />
    <use href="#vine-flower" x="0" y="0" />
  </g>
  <g transform="translate(599, 895) scale(1.4)">
    <use href="#vine-leaf" x="0" y="0" transform="rotate(-135)" />
    <use href="#vine-flower" x="0" y="0" />
  </g>
  <g transform="translate(332, 24) scale(1.1)">
    <use href="#vine-leaf" x="0" y="0" transform="rotate(90)" />
  </g>
  <g transform="translate(332, 936) scale(1.1)">
    <use href="#vine-leaf" x="0" y="0" transform="rotate(-90)" />
  </g>
  <g transform="translate(24, 480) scale(1.1)">
    <use href="#vine-leaf" x="0" y="0" />
  </g>
  <g transform="translate(640, 480) scale(1.1)">
    <use href="#vine-leaf" x="0" y="0" transform="rotate(180)" />
  </g>
</svg>
`);

// Elegant Royal Vintage Gold & Crimson Arch Frame
export const FRAME_ASSET_ROYAL = "data:image/svg+xml;utf8," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 664 960" width="100%" height="100%">
  <defs>
    <linearGradient id="royal-gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFDF0" />
      <stop offset="25%" stop-color="#FCD34D" />
      <stop offset="50%" stop-color="#D97706" />
      <stop offset="75%" stop-color="#92400E" />
      <stop offset="100%" stop-color="#451A03" />
    </linearGradient>
    <linearGradient id="royal-purple" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F3E8FF" />
      <stop offset="50%" stop-color="#A855F7" />
      <stop offset="100%" stop-color="#581C87" />
    </linearGradient>
    <g id="royal-crown">
      <path d="M -12 6 L -16 -12 L -6 -4 L 0 -16 L 6 -4 L 16 -12 L 12 6 Z" fill="url(#royal-gold)" stroke="#451A03" stroke-width="2" stroke-linejoin="round" />
      <rect x="-14" y="6" width="28" height="4" fill="url(#royal-purple)" stroke="#451A03" stroke-width="1.5" rx="1" />
      <circle cx="-16" cy="-12" r="2" fill="#FCD34D" />
      <circle cx="0" cy="-16" r="2" fill="#FCD34D" />
      <circle cx="16" cy="-12" r="2" fill="#FCD34D" />
    </g>
    <g id="fleur-de-lis">
      <path d="M 0 -8 C 3 -8, 6 -3, 0 10 C -6 -3, -3 -8, 0 -8 Z" fill="url(#royal-gold)" stroke="#451A03" stroke-width="1.8"/>
      <path d="M 0 -2 C 8 -2, 10 4, 4 8 C 0 8, 2 2, 0 -2 Z" fill="url(#royal-gold)" stroke="#451A03" stroke-width="1.8"/>
      <path d="M 0 -2 C -8 -2, -10 4, -4 8 C 0 8, -2 2, 0 -2 Z" fill="url(#royal-gold)" stroke="#451A03" stroke-width="1.8"/>
      <rect x="-6" y="2" width="12" height="2" fill="#451A03" />
    </g>
  </defs>
  <rect x="8" y="8" width="648" height="944" rx="16" fill="none" stroke="url(#royal-gold)" stroke-width="8" />
  <rect x="18" y="18" width="628" height="924" rx="12" fill="none" stroke="#451A03" stroke-width="3" />
  <g stroke="url(#royal-gold)" stroke-width="4" fill="none" stroke-linecap="round">
    <path d="M 30 110 C 30 50, 50 30, 110 30" />
    <path d="M 634 110 C 634 50, 614 30, 554 30" />
    <path d="M 30 850 C 30 910, 50 930, 110 930" />
    <path d="M 634 850 C 634 910, 614 930, 554 930" />
  </g>
  <rect x="42" y="42" width="580" height="876" rx="4" fill="none" stroke="#451A03" stroke-width="8" />
  <rect x="50" y="50" width="564" height="860" rx="2" fill="none" stroke="url(#royal-gold)" stroke-width="4" />
  <g transform="translate(68, 68) scale(1.4)">
    <use href="#royal-crown" x="0" y="0" />
  </g>
  <g transform="translate(596, 68) scale(1.4)">
    <use href="#royal-crown" x="0" y="0" />
  </g>
  <g transform="translate(68, 892) scale(1.4)">
    <use href="#royal-crown" x="0" y="0" />
  </g>
  <g transform="translate(596, 892) scale(1.4)">
    <use href="#royal-crown" x="0" y="0" />
  </g>
  <g transform="translate(332, 28) scale(1.2)">
    <use href="#fleur-de-lis" x="0" y="0" />
  </g>
  <g transform="translate(332, 932) scale(1.2)">
    <use href="#fleur-de-lis" x="0" y="0" />
  </g>
</svg>
`);

// Cute Soft Pastel Pink Ribbon & Bow Heart Frame
export const FRAME_ASSET_RIBBON = "data:image/svg+xml;utf8," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 664 960" width="100%" height="100%">
  <defs>
    <linearGradient id="pastel-pink" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF0F2" />
      <stop offset="100%" stop-color="#FCE7F3" />
    </linearGradient>
    <linearGradient id="ribbon-rose" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FBCFE8" />
      <stop offset="50%" stop-color="#F472B6" />
      <stop offset="100%" stop-color="#DB2777" />
    </linearGradient>
    <g id="ribbon-bow">
      <path d="M -12 -6 C -20 -15, -5 -18, 0 -3 C 5 -18, 20 -15, 12 -6 Z" fill="url(#ribbon-rose)" stroke="#9D174D" stroke-width="2" />
      <path d="M -5 -2 L -15 15 L -8 15 Z" fill="url(#ribbon-rose)" stroke="#9D174D" stroke-width="1.8" />
      <path d="M 5 -2 L 15 15 L 8 15 Z" fill="url(#ribbon-rose)" stroke="#9D174D" stroke-width="1.8" />
      <circle cx="0" cy="-3" r="4.5" fill="#FDF2F8" stroke="#9D174D" stroke-width="2" />
    </g>
    <g id="mini-heart">
      <path d="M 0 3 C -2 -1, -6 -1, -6 3 C -6 7, 0 12, 0 12 C 0 12, 6 7, 6 3 C 6 -1, 2 -1, 0 3 Z" fill="#F472B6" stroke="#9D174D" stroke-width="1.5" />
    </g>
  </defs>
  <rect x="8" y="8" width="648" height="944" rx="14" fill="none" stroke="#F472B6" stroke-width="4" />
  <rect x="14" y="14" width="636" height="932" rx="11" fill="none" stroke="#FCE7F3" stroke-width="6" />
  <rect x="22" y="22" width="620" height="916" rx="8" fill="none" stroke="#9D174D" stroke-width="2" />
  <rect x="30" y="30" width="604" height="900" rx="6" fill="none" stroke="#FBCFE8" stroke-width="2" stroke-dasharray="8 6" />
  <rect x="38" y="38" width="588" height="884" rx="4" fill="none" stroke="#9D174D" stroke-width="3" />
  <g transform="translate(64, 64) scale(1.3)">
    <use href="#ribbon-bow" x="0" y="0" />
  </g>
  <g transform="translate(600, 64) scale(1.3)">
    <use href="#ribbon-bow" x="0" y="0" />
  </g>
  <g transform="translate(64, 896) scale(1.3)">
    <use href="#ribbon-bow" x="0" y="0" />
  </g>
  <g transform="translate(600, 896) scale(1.3)">
    <use href="#ribbon-bow" x="0" y="0" />
  </g>
  <g transform="translate(332, 24) scale(1.3)">
    <use href="#mini-heart" x="0" y="0" />
  </g>
  <g transform="translate(332, 936) scale(1.3)">
    <use href="#mini-heart" x="0" y="0" />
  </g>
  <g transform="translate(24, 480) scale(1.3)">
    <use href="#mini-heart" x="0" y="0" />
  </g>
  <g transform="translate(640, 480) scale(1.3)">
    <use href="#mini-heart" x="0" y="0" />
  </g>
</svg>
`);

export const FRAME_ASSET_CELESTIAL = "data:image/svg+xml;utf8," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 664 960" width="100%" height="100%">
  <defs>
    <!-- Celestial Deep Midnight Gradient -->
    <linearGradient id="celestial-midnight" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#020617" />
      <stop offset="50%" stop-color="#0F172A" />
      <stop offset="100%" stop-color="#1E293B" />
    </linearGradient>
    
    <!-- Celestial Golden Moon & Star Gradient -->
    <linearGradient id="celestial-gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFDF0" />
      <stop offset="40%" stop-color="#FCD34D" />
      <stop offset="80%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#78350F" />
    </linearGradient>

    <!-- Star Glow Gradient -->
    <radialGradient id="star-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#38BDF8" stop-opacity="1" />
      <stop offset="40%" stop-color="#0284C7" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#0284C7" stop-opacity="0" />
    </radialGradient>

    <!-- Reusable Crescent Moon -->
    <g id="celestial-moon">
      <path d="M 0 -12 A 12 12 0 1 0 12 0 A 9.5 9.5 0 1 1 0 -12 Z" fill="url(#celestial-gold)" stroke="#020617" stroke-width="2.2" stroke-linejoin="round" />
    </g>

    <!-- Reusable Pixelated Star -->
    <g id="celestial-star">
      <!-- Outer glow -->
      <circle cx="0" cy="0" r="12" fill="url(#star-glow)" />
      <!-- Sharp 4-point gold star -->
      <path d="M 0 -9 Q 0 0 -9 0 Q 0 0 0 9 Q 0 0 9 0 Q 0 0 0 -9 Z" fill="#FFFFFF" stroke="#020617" stroke-width="1.5" stroke-linejoin="round" />
      <circle cx="0" cy="0" r="2.5" fill="#FCD34D" />
    </g>
  </defs>

  <!-- Borders -->
  <rect x="8" y="8" width="648" height="944" rx="14" fill="none" stroke="#020617" stroke-width="6" />
  <rect x="14" y="14" width="636" height="932" rx="12" fill="none" stroke="url(#celestial-gold)" stroke-width="8" />
  <rect x="22" y="22" width="620" height="916" rx="8" fill="none" stroke="#0F172A" stroke-width="2.5" />
  <rect x="30" y="30" width="604" height="900" rx="6" fill="none" stroke="#0284C7" stroke-width="1.5" stroke-dasharray="12 10" />
  <rect x="38" y="38" width="588" height="884" rx="4" fill="none" stroke="#020617" stroke-width="3" />

  <!-- Corner Moons -->
  <use href="#celestial-moon" x="0" y="0" transform="translate(64, 64) scale(1.4) rotate(-30)" />
  <use href="#celestial-moon" x="0" y="0" transform="translate(600, 64) scale(1.4) rotate(45)" />
  <use href="#celestial-moon" x="0" y="0" transform="translate(64, 896) scale(1.4) rotate(-120)" />
  <use href="#celestial-moon" x="0" y="0" transform="translate(600, 896) scale(1.4) rotate(135)" />

  <!-- Side Stars -->
  <use href="#celestial-star" x="0" y="0" transform="translate(332, 24) scale(1.3)" />
  <use href="#celestial-star" x="0" y="0" transform="translate(332, 936) scale(1.3)" />
  <use href="#celestial-star" x="0" y="0" transform="translate(24, 480) scale(1.3)" />
  <use href="#celestial-star" x="0" y="0" transform="translate(640, 480) scale(1.3)" />

  <!-- Little Accent Stars along borders -->
  <use href="#celestial-star" x="0" y="0" transform="translate(180, 24) scale(0.8)" />
  <use href="#celestial-star" x="0" y="0" transform="translate(484, 24) scale(0.8)" />
  <use href="#celestial-star" x="0" y="0" transform="translate(180, 936) scale(0.8)" />
  <use href="#celestial-star" x="0" y="0" transform="translate(484, 936) scale(0.8)" />
  <use href="#celestial-star" x="0" y="0" transform="translate(24, 240) scale(0.8)" />
  <use href="#celestial-star" x="0" y="0" transform="translate(24, 720) scale(0.8)" />
  <use href="#celestial-star" x="0" y="0" transform="translate(640, 240) scale(0.8)" />
  <use href="#celestial-star" x="0" y="0" transform="translate(640, 720) scale(0.8)" />
</svg>
`);

export const FRAME_ASSET_SAKURA = "data:image/svg+xml;utf8," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 664 960" width="100%" height="100%">
  <defs>
    <!-- Sakura Blossom Pink Gradient -->
    <linearGradient id="sakura-pink" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF1F2" />
      <stop offset="50%" stop-color="#FBCFE8" />
      <stop offset="100%" stop-color="#F472B6" />
    </linearGradient>
    
    <!-- Delicate Soft Green Foliage Gradient -->
    <linearGradient id="sakura-leaf" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F0FDF4" />
      <stop offset="100%" stop-color="#86EFAC" />
    </linearGradient>

    <!-- Glowing Pixie Dust Radial Gradient -->
    <radialGradient id="pixie-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FDF2F8" stop-opacity="1" />
      <stop offset="50%" stop-color="#F472B6" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#F472B6" stop-opacity="0" />
    </radialGradient>

    <!-- Reusable 5-Petal Cherry Blossom -->
    <g id="sakura-flower">
      <!-- 5 overlapping circle petals with cute dark-crimson outlines -->
      <circle cx="0" cy="-6" r="5.5" fill="url(#sakura-pink)" stroke="#9D174D" stroke-width="1.5" />
      <circle cx="5.5" cy="-2" r="5.5" fill="url(#sakura-pink)" stroke="#9D174D" stroke-width="1.5" />
      <circle cx="3.5" cy="5" r="5.5" fill="url(#sakura-pink)" stroke="#9D174D" stroke-width="1.5" />
      <circle cx="-3.5" cy="5" r="5.5" fill="url(#sakura-pink)" stroke="#9D174D" stroke-width="1.5" />
      <circle cx="-5.5" cy="-2" r="5.5" fill="url(#sakura-pink)" stroke="#9D174D" stroke-width="1.5" />
      <!-- Center pistil -->
      <circle cx="0" cy="0" r="3" fill="#FEF3C7" stroke="#9D174D" stroke-width="1.2" />
    </g>

    <!-- Reusable Soft Leaf -->
    <g id="sakura-green-leaf">
      <path d="M 0 -8 Q 4 -4, 0 8 Q -4 -4, 0 -8 Z" fill="url(#sakura-leaf)" stroke="#166534" stroke-width="1.5"/>
    </g>

    <!-- Reusable Falling Sakura Petal -->
    <g id="sakura-petal">
      <path d="M 0 0 C -4 -4, -4 -9, 0 -11 C 4 -9, 4 -4, 0 0" fill="url(#sakura-pink)" stroke="#9D174D" stroke-width="1.2" />
    </g>
  </defs>

  <!-- Borders with soft cherry-colored and pink pastel lines -->
  <rect x="8" y="8" width="648" height="944" rx="14" fill="none" stroke="#9D174D" stroke-width="5" />
  <rect x="13" y="13" width="638" height="934" rx="12" fill="none" stroke="#FFF1F2" stroke-width="8" />
  <rect x="21" y="21" width="622" height="918" rx="8" fill="none" stroke="#F472B6" stroke-width="2.5" />
  <rect x="29" y="29" width="606" height="902" rx="6" fill="none" stroke="#9D174D" stroke-width="1.5" stroke-dasharray="10 8" />
  <rect x="37" y="37" width="590" height="886" rx="4" fill="none" stroke="#FFF1F2" stroke-width="4" />

  <!-- Corner Cherry Blossom Clusters (with leaves and floating petals) -->
  <g transform="translate(64, 64)">
    <use href="#sakura-green-leaf" transform="rotate(-45) translate(0, -6) scale(1.2)" />
    <use href="#sakura-green-leaf" transform="rotate(45) translate(0, -6) scale(1)" />
    <use href="#sakura-flower" transform="scale(1.4)" />
    <use href="#sakura-flower" transform="translate(12, 10) scale(1)" />
  </g>

  <g transform="translate(600, 64)">
    <use href="#sakura-green-leaf" transform="rotate(45) translate(0, -6) scale(1.2)" />
    <use href="#sakura-green-leaf" transform="rotate(-45) translate(0, -6) scale(1)" />
    <use href="#sakura-flower" transform="scale(1.4)" />
    <use href="#sakura-flower" transform="translate(-12, 10) scale(1)" />
  </g>

  <g transform="translate(64, 896)">
    <use href="#sakura-green-leaf" transform="rotate(-135) translate(0, -6) scale(1.2)" />
    <use href="#sakura-flower" transform="scale(1.4)" />
    <use href="#sakura-flower" transform="translate(12, -10) scale(1)" />
  </g>

  <g transform="translate(600, 896)">
    <use href="#sakura-green-leaf" transform="rotate(135) translate(0, -6) scale(1.2)" />
    <use href="#sakura-flower" transform="scale(1.4)" />
    <use href="#sakura-flower" transform="translate(-12, -10) scale(1)" />
  </g>

  <!-- Side center cherry blossoms -->
  <use href="#sakura-flower" x="0" y="0" transform="translate(332, 22) scale(1.3)" />
  <use href="#sakura-flower" x="0" y="0" transform="translate(332, 938) scale(1.3)" />
  <use href="#sakura-flower" x="0" y="0" transform="translate(22, 480) scale(1.3)" />
  <use href="#sakura-flower" x="0" y="0" transform="translate(642, 480) scale(1.3)" />

  <!-- Floating Falling Petals / Pixie sparkles along the frame -->
  <use href="#sakura-petal" transform="translate(180, 24) rotate(15) scale(1.1)" />
  <use href="#sakura-petal" transform="translate(484, 24) rotate(-30) scale(0.9)" />
  <use href="#sakura-petal" transform="translate(180, 936) rotate(45) scale(1)" />
  <use href="#sakura-petal" transform="translate(484, 936) rotate(-15) scale(1.1)" />
  <use href="#sakura-petal" transform="translate(24, 240) rotate(-60) scale(0.8)" />
  <use href="#sakura-petal" transform="translate(24, 720) rotate(80) scale(1.2)" />
  <use href="#sakura-petal" transform="translate(640, 240) rotate(10) scale(1)" />
  <use href="#sakura-petal" transform="translate(640, 720) rotate(-45) scale(0.9)" />
</svg>
`);

export function getFrameAsset(style?: string): string {
  if (style === "type2") return FRAME_ASSET_VINE;
  if (style === "type3") return FRAME_ASSET_ROYAL;
  if (style === "type4") return FRAME_ASSET_RIBBON;
  if (style === "type5") return FRAME_ASSET_CELESTIAL;
  if (style === "type6") return FRAME_ASSET_SAKURA;
  return FRAME_ASSET;
}

export const initialStoryState: LoveStoryState = {
  frameStyle: "type1",
  weather: "none",
  gateTitle: "A Gift For You",
  gateSub: "Open when ready",
  hubTitle: "OurFairyLoveStory",
  timeline: [
    {
      emoji: "🌱",
      date: "Where it began",
      title: "The Day We Met",
      text: "Replace this with the story of how you two first crossed paths and the spark that started it all."
    },
    {
      emoji: "☕",
      date: "First date",
      title: "That Nervous Afternoon",
      text: "Describe your first date — the place, the butterflies in your stomach, and the moment you knew they were special."
    },
    {
      emoji: "✈️",
      date: "An adventure",
      title: "The Trip That Changed Everything",
      text: "Tell the story of an unforgettable trip or shared adventure that brought you infinitely closer together."
    },
    {
      emoji: "🏡",
      date: "Building a life",
      title: "Moving In Together",
      text: "Talk about the beautiful milestone of building a warm, cozy home and nesting together side by side."
    },
    {
      emoji: "💖",
      date: "Today",
      title: "Right Now",
      text: "End with where you are today, reflecting on your love and why this present moment is the absolute sweetest."
    }
  ],
  gallery: [
    { caption: "Our very first photo together", media: "", mediaType: "image" },
    { caption: "That silly weekend trip", media: "", mediaType: "image" },
    { caption: "A quiet, cozy Sunday morning", media: "", mediaType: "image" },
    { caption: "Celebrating our milestones", media: "", mediaType: "image" },
    { caption: "Just us, being completely silly", media: "", mediaType: "image" },
    { caption: "Our favorite lazy afternoon", media: "", mediaType: "image" }
  ],
  memoryLogGallery: [
    { caption: "Album memory: Hand in hand", media: "", mediaType: "image" },
    { caption: "Album memory: Laughing together", media: "", mediaType: "image" },
    { caption: "Album memory: Cozy Sundays", media: "", mediaType: "image" }
  ],
  countdownTitle: "Countdown",
  countdownDate: (() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return d.toISOString().slice(0, 10);
  })(),
  countdownSub: "Until our next beautiful adventure together",
  anniversaryDate: "2024-05-15",
  reasons: [
    "Because you make ordinary, mundane days feel like cozy adventures.",
    "Because you laugh at my terrible jokes even when they aren't funny.",
    "Because of the safe, peaceful way you say my name.",
    "Because you show up with absolute devotion, even on my hardest days.",
    "Because home is no longer a physical place — it's wherever you are.",
    "Because you remember the tiny details I assumed everyone would forget.",
    "Because you make me want to grow, learn, and be the best version of myself.",
    "Because of your immense kindness and the way you care for animals.",
    "Because you're my favorite person to sit in comfortable silence with.",
    "Because, simply and entirely, of the beautiful soul you are."
  ],
  quiz: [
    {
      q: "Where did we first cross paths?",
      options: ["A cozy coffee shop", "Through mutual friends", "At a lively social event", "On an unexpected trip"],
      correct: 0
    },
    {
      q: "What did we do on our very first date?",
      options: ["Had a candlelit dinner", "Went on a scenic walk", "Watched a movie", "Grabbed warm coffee"],
      correct: 1
    },
    {
      q: "Which song instantly makes me think of you?",
      options: ["Our Anthem", "That Sweet Melody", "The Acoustic Tune", "Our Roadtrip Song"],
      correct: 2
    },
    {
      q: "What is my absolute favorite thing about you?",
      options: ["Your bright, crinkly laugh", "Your infinite kindness", "Your silly sense of humor", "All of it, every single detail"],
      correct: 3
    }
  ],
  audioName: "",
  audioData: "",
  voiceNote: "Press play to listen to a sweet tune",
  finaleMessage: "To the person who makes every single day feel like something worth celebrating —\n\nThank you for being exactly who you are, for your patience, your warmth, and the safety you give me.\n\nHere is to many more chapters, infinite laughs, cozy Sundays, and a lifetime of adventures side by side.\n\nWith all my love, forever and always.",
  youtubeUrl: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
  hidePlayerVisuals: false,
  theme: "day"
};
