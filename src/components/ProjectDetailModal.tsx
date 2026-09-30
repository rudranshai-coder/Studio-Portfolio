import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Image as ImageIcon,
  Compass,
  CheckCircle2,
  Maximize2,
  Minimize2,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkle,
  RotateCcw,
  Film,
  FastForward,
  Gauge,
  Video,
  Mail,
  MessageSquare,
  Copy,
  Zap,
  ArrowUpRight,
  Check,
  Link2,
} from 'lucide-react';
import { ProjectItem, CategoryInfo } from '../types';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  allProjects: ProjectItem[];
  categoryInfo?: CategoryInfo;
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (project: ProjectItem) => void;
}

// Scene descriptions for multi-visual projects
const PROJECT_SCENES_MAP: Record<string, Array<{ act: string; title: string; desc: string; setting: string; time?: number }>> = {
  'fashion-01': [
    {
      act: 'Act 01',
      title: 'Royal Garden Jasmine Basket',
      desc: 'Woman in magenta pink silk saree holding a handwoven wicker basket filled with fresh white jasmine blossoms in a sunlit palace garden.',
      setting: 'Lush Palace Garden & Royal Heritage Pavilion',
      time: 0,
    },
    {
      act: 'Act 02',
      title: 'Palace Courtyard Garland Threading',
      desc: 'Seated gracefully on a teak garden bench in a colonnaded courtyard, hand-stringing fragrant jasmine flowers into traditional gajra.',
      setting: 'Stone Colonnaded Courtyard with Golden Hour Flare',
      time: 3.8,
    },
    {
      act: 'Act 03',
      title: 'Sunset Balcony Terrace Overlook',
      desc: 'Standing in 3/4 profile on an elevated carved balustrade terrace at golden hour twilight, gently adjusting the jasmine garland in her hair.',
      setting: 'Carved Sandstone Terrace overlooking Mughal Gardens',
      time: 7.6,
    },
    {
      act: 'Act 04',
      title: 'Sunlit French Window Solitude',
      desc: 'Contemplative pose seated beside an open arched French window as soft volumetric sunbeams stream into the palatial salon.',
      setting: 'Sunlit Heritage Palace Interior Salon',
      time: 11.4,
    },
    {
      act: 'Act 05',
      title: 'Radiant Garden Walkway Portrait',
      desc: 'Full-length standing walking stance along blooming garden paths, displaying the full flare of the gold zari brocade pallu and pleats.',
      setting: 'Tropical Palace Walkway lined with Jasmine Shrubs',
      time: 15.2,
    },
  ],
  'fashion-02': [
    {
      act: 'Slide 01',
      title: 'Modern Tailored Silhouette',
      desc: 'Structured contemporary couture tailoring captured with crisp key-lighting and refined elegance.',
      setting: 'Studio Editorial Set A',
    },
    {
      act: 'Slide 02',
      title: 'Monochrome Contrast & Drape',
      desc: 'High-contrast studio portrait emphasizing fabric drape, textured layers, and confident posture.',
      setting: 'High-Fashion Studio',
    },
    {
      act: 'Slide 03',
      title: 'Sculptural Form & Light Balance',
      desc: 'Balanced rim-lighting highlighting garment geometry and modern haute couture styling.',
      setting: 'Couture Editorial Bay',
    },
    {
      act: 'Slide 04',
      title: 'Dynamic Runway-Inspired Look',
      desc: 'Sleek visual styling showcasing fluidity of movement and commercial editorial color grading.',
      setting: 'Runway Lookbook Studio',
    },
    {
      act: 'Slide 05',
      title: 'Close-Up Editorial Artistry',
      desc: 'High-clarity beauty portrait showcasing makeup artistry, hair detailing, and neutral backdrop tones.',
      setting: 'Macro Beauty & Editorial',
    },
  ],
  'fashion-03': [
    {
      act: 'Slide 01',
      title: 'Hero OVERLAYS Editorial Silhouette & Modern Form',
      desc: 'Hero commercial editorial composition showcasing the OVERLAYS signature contemporary streetwear silhouette, clean architectural lines, structured shoulders, and directional key lighting.',
      setting: 'OVERLAYS Signature Editorial Studio & Directional Keylight',
    },
    {
      act: 'Slide 02',
      title: 'Structured Oversized Drape & Streetwear Geometry',
      desc: 'Modern streetwear perspective highlighting the structured oversized drape, premium heavyweight cotton blend construction, and ergonomic tailoring of the OVERLAYS collection.',
      setting: 'Contemporary Minimalist Bay & High-Contrast Rim Light',
    },
    {
      act: 'Slide 03',
      title: 'Minimalist Layering & Neutral Palette Aesthetics',
      desc: 'Editorial styling capturing layered textures, refined tonal neutrals, relaxed proportions, and subtle high-fashion branding signature to OVERLAYS.',
      setting: 'Architectural Set & Soft Ambient Diffused Strobes',
    },
    {
      act: 'Slide 04',
      title: 'OVERLAYS Brand Campaign Showcase & Lookbook',
      desc: 'High-conversion commercial campaign presentation celebrating the OVERLAYS contemporary streetwear identity, casual luxury aesthetics, and multi-channel lookbook presence.',
      setting: 'OVERLAYS Commercial Lookbook & Studio Master Setup',
    },
  ],
  'fashion-04': [
    {
      act: 'Slide 01',
      title: 'The Midnight Botanist — Stone Promenade & Architectural Drape',
      desc: 'Full-length statuesque promenade portrait on an idyllic lakeside stone walkway. The model stands poised in a deep midnight-blue semi-sheer organza saree adorned with delicate silver botanical branch silhouettes and vertical pinstripe accents, framed by a tailored scoop-neck blouse and illuminated by golden-hour sunlight against distant mountain peaks.',
      setting: 'Lakeside Stone Promenade & Soft Golden-Hour Backlight',
    },
    {
      act: 'Slide 02',
      title: 'Azure Serenity — Riverside Ledge & Contemplative Poise',
      desc: 'A graceful three-quarter seated editorial composition along a rustic stone riverbank retaining wall. The soft-waved curls and translucent fabric catch gentle afternoon rim lighting, highlighting the intricate silver zari weave, oxidized bell-shaped jhumkas, and demure lap pose against hazy forested hills.',
      setting: 'Mountain Riverbank Retaining Wall & Diffused Afternoon Glow',
    },
    {
      act: 'Slide 03',
      title: 'Kinetic Ripples — Lakeside Skipping Stone & Action Editorial',
      desc: 'Dynamic candid-action profile capture leaning over the stone balustrade in mid-motion, skipping a stone across the calm alpine water. The kinetic movement injects spontaneous vitality into the artisanal linen-silk drape, silver bangles, and tranquil mountain reflection.',
      setting: 'Mountain Lake Balustrade & Kinetic Water Reflection',
    },
  ],
  'fashion-05': [
    {
      act: 'Slide 01',
      title: 'The Courtyard Poise — Handcrafted Mirror-Work Placket & Symmetry',
      desc: 'Statuesque full-length portrait in a grand Indo-Saracenic marble courtyard. The model stands poised with clasped hands, highlighting the V-neck mirror-work placket, metallic gold mandala block prints, and sheer draped dupatta.',
      setting: 'White Marble Palace Courtyard & Diffused Daylight',
    },
    {
      act: 'Slide 02',
      title: 'Petals of Serenity — Festive Urli Floral Arrangement on Marble Steps',
      desc: 'Gracefully seated upon polished marble steps beside hand-carved floral pillars, delicately arranging pink and white blossoms in an artisanal brass urli bowl amidst scattered celebratory petals.',
      setting: 'Palace Pavilion Steps & Hand-Carved Marble Pillar',
    },
    {
      act: 'Slide 03',
      title: 'Wind-Swept Majesty — Balcony Promenade & Billowing Golden Zari Dupatta',
      desc: 'Full-length dynamic profile capture along the palace terrace balustrade during golden hour. The ornate gold-printed crimson dupatta catches the breeze, billowing dramatically against open sky and scalloped arches.',
      setting: 'Palace Balcony Terrace & Golden-Hour Horizon',
    },
    {
      act: 'Slide 04',
      title: 'The Royal Corridor — Contemplative Tea Repose Amidst Marble Colonnades',
      desc: 'Refined three-quarter seated editorial composition in an ornate palace colonnade. Holding a fine porcelain teacup in tranquil contemplation, highlighting clean trouser tailoring and ambient courtyard illumination.',
      setting: 'Royal Palace Colonnade & Scalloped Marble Arches',
    },
    {
      act: 'Slide 05',
      title: 'The Palace Courtyard Flight — Golden-Hour Pigeon Reverie & Living Heritage',
      desc: 'Dynamic full-length candid capture in the sunlit palace garden, scattering grain as pigeons take flight in warm backlit rays, capturing natural vitality, fluid silk movement, and effortless royal poise.',
      setting: 'Palace Garden Courtyard & Golden-Hour Backlight',
    },
  ],
  'fashion-ads-01': [
    {
      act: 'Act 01',
      title: 'Heritage Estate Wrought-Iron Gate',
      desc: 'Full-length walking approach through towering ornate gilded palace gates in a pastel pistachio green raw silk saree with 22K gold zari border.',
      setting: 'Royal Palace Grounds & Gilded Heritage Gate',
      time: 0,
    },
    {
      act: 'Act 02',
      title: '22K Gold Bangles & Micro Pleats',
      desc: 'Handcrafted antique 22K gold filigree kada bangles and floral booti embroidery detail cascading along pleated raw silk fabric.',
      setting: 'Artisan Macro Detail & Traditional Gold Filigree',
      time: 3.8,
    },
    {
      act: 'Act 03',
      title: 'Lotus Pond & Tree of Life Pallu',
      desc: 'Macro artisan view of hand-embroidered pink lotus pond motifs, winding resham thread vines, and cascading silk latkan tassels.',
      setting: 'Luxury Textile Weave & Silk Thread Embroidery',
      time: 7.6,
    },
    {
      act: 'Act 04',
      title: 'Golden Hour Courtyard Garden Bench',
      desc: 'Serene contemplative seated pose on a teakwood bench beneath towering palms as warm golden sunlight filters through the courtyard.',
      setting: 'Sun-Drenched Palace Courtyard & Stone Balustrades',
      time: 11.4,
    },
    {
      act: 'Act 05',
      title: 'Radiant High-Fashion Portrait',
      desc: 'Medium closeup lookbook portrait radiating royal heritage, confidence, and timeless elegance framed by lush tropical greenery.',
      setting: 'Luxury Lookbook & Editorial Golden Glow',
      time: 15.2,
    },
  ],
  'fashion-ads-02': [
    {
      act: 'Act 01',
      title: 'Hero Kurti Silhouette & Embroidered Yoke Entry',
      desc: 'Frontal festive model entrance showcasing the rich designer kurti silhouette, intricately embroidered neckline yoke, and warm directional studio rim lighting.',
      setting: 'Festive Couture Studio & Warm Rim Lighting',
      time: 0,
    },
    {
      act: 'Act 02',
      title: 'Macro Resham Threadwork & Zari Embellishments',
      desc: 'High-speed macro tracking lens capturing fine resham threadwork, shimmering sequin micro-facets, and handcrafted gotapatti sleeve border detailing.',
      setting: 'Macro Textile & Embroidery Capture',
      time: 3.2,
    },
    {
      act: 'Act 03',
      title: 'Dynamic Anarkali Flare & 360° Twirl Physics',
      desc: 'Sweeping 360-degree rotational camera movement highlighting the voluminous kurti flare, lightweight georgette/chanderi drape, and fluid motion turbulence.',
      setting: '360° Motion Capture Stage',
      time: 6.8,
    },
    {
      act: 'Act 04',
      title: 'Graceful Dupatta Drape & Festive Styling',
      desc: 'Editorial slow-motion tracking capturing the flowing organza dupatta drape, delicate border tassels, and versatile festive styling accents.',
      setting: 'Editorial Lookbook & Ambient Strobe',
      time: 10.4,
    },
    {
      act: 'Act 05',
      title: 'Grand Festive Lookbook Finale & Brand CTA',
      desc: 'Radiant closing lookbook pose with warm golden backdrop, high-converting commercial clarity, and @rgcreation711 signature direction.',
      setting: 'Ethnic Festive Campaign Finale Lookbook',
      time: 14.0,
    },
  ],
  'fashion-ads-03': [
    {
      act: 'Act 01',
      title: 'The Beach Stroll & Horizon Print Entry',
      desc: 'Frontal walking approach along the tropical shoreline wearing a tailored two-piece linen co-ord set featuring an all-over hand-painted beach landscape print.',
      setting: 'Pristine Tropical Shoreline & Ocean Breeze',
      time: 0,
    },
    {
      act: 'Act 02',
      title: 'Coastal Passage & Surf Splashes',
      desc: 'Low-angle side tracking shot through incoming ocean tide, highlighting lightweight fluid linen drapery and carefree vacation freedom.',
      setting: 'Sun-Drenched Coastal Waters & Azure Waves',
      time: 4.0,
    },
    {
      act: 'Act 03',
      title: 'The Refined Detail & Luxury Accents',
      desc: 'High-definition close-up focusing on the camp-collar shirt, tropical palm motifs, gold pendant necklace, and luxury gold chronograph timepiece.',
      setting: 'Sunlit Beach Resort Deck & High-Contrast Daylight',
      time: 9.0,
    },
    {
      act: 'Act 04',
      title: 'The Surfer’s Ease & Active Jetsetter',
      desc: 'Full-body statuesque stride across golden sands carrying a surfboard underarm, establishing the aspirational luxury coastal lifestyle.',
      setting: 'Expansive Golden Beach & Open Horizon',
      time: 14.0,
    },
    {
      act: 'Act 05',
      title: 'Sunset Serenity & Resort Lounger Finale',
      desc: 'Golden-hour beach club relaxation reclining on a teak lounger with a tropical cocktail, embodying timeless resort elegance and vacation ease.',
      setting: 'Sunset Beach Club & Palm Frond Canopy',
      time: 20.0,
    },
  ],
  'fashion-ads-04': [
    {
      act: 'Act 01',
      title: 'The Flute Prelude & Temple Ghat Poise',
      desc: 'Regal medium portrait holding a handcrafted wooden bansuri flute on sacred riverfront stone steps draped in vibrant orange marigold garlands.',
      setting: 'Sacred Riverside Ghat & Marigold Garlands',
      time: 0,
    },
    {
      act: 'Act 02',
      title: 'The Riverside Turn & Golden Hour Flares',
      desc: 'Graceful pivot overlooking the tranquil river as low-angle golden-hour sunlight creates an ethereal amber lens flare across the back blouse and dupatta.',
      setting: 'Open-Air Riverfront Ghat & Golden-Hour Water Reflections',
      time: 6.0,
    },
    {
      act: 'Act 03',
      title: '22K Gold Zari Brocade & Seedha Pallu Drape',
      desc: 'Macro pan across dense gold zari floral embroidery along the crimson skirt, detailed border trims, and vibrant saffron yellow printed dupatta.',
      setting: 'Carved Stone Temple Pillar & Intricate Brocade Weave',
      time: 12.0,
    },
    {
      act: 'Act 04',
      title: 'The Sacred Offering & 360° Lehenga Flare',
      desc: 'Fluid rotational camera tracking capturing the voluminous circular twirl of the lehenga skirt as the muse carries a traditional decorative thali.',
      setting: 'Temple Ghat Dock & Traditional Wooden Boat',
      time: 18.0,
    },
    {
      act: 'Act 05',
      title: 'Divine Grace & Peacock Feather Reverie',
      desc: 'Enchanting direct-to-camera smile holding a sacred peacock feather, radiating timeless devotion, spiritual grace, and regal festive warmth.',
      setting: 'Heritage Temple Stone Alcove & Warm Evening Glow',
      time: 24.0,
    },
  ],
  'product-01': [
    {
      act: 'Slide 01',
      title: 'Hero Presentation',
      desc: 'Frontal studio composition showcasing the perfume bottle with soft lighting and natural reflections.',
      setting: 'Frontal Studio Setup',
    },
    {
      act: 'Slide 02',
      title: 'Glass & Cap Detail',
      desc: 'Close-up highlighting glass clarity, liquid depth, and cap craftsmanship.',
      setting: 'Detail Angle',
    },
    {
      act: 'Slide 03',
      title: 'Three-Quarter View',
      desc: 'Angular perspective emphasizing clean bottle contours and gentle shadow contrast.',
      setting: 'Three-Quarter Angle',
    },
    {
      act: 'Slide 04',
      title: 'Ambient Staging',
      desc: 'Mood-focused visual with warm ambient tones and subtle highlights.',
      setting: 'Ambient Staging',
    },
    {
      act: 'Slide 05',
      title: 'Rim Light Setup',
      desc: 'Sculpted lighting accentuating the glass edges and rich fragrance color.',
      setting: 'Rim Light Setup',
    },
    {
      act: 'Slide 06',
      title: 'Commercial Campaign',
      desc: 'Final polished editorial visual for luxury fragrance presentation.',
      setting: 'Editorial Campaign',
    },
  ],
  'product-02': [
    {
      act: 'Slide 01',
      title: 'Hero STRIDE SOLE Silhouette & Kinetic Profile',
      desc: 'Frontal studio composition showcasing the own-designed STRIDE SOLE sneaker silhouette with aerodynamic contouring, energetic color accents, and crisp studio lighting.',
      setting: 'Hero Commercial Studio Master Setup',
    },
    {
      act: 'Slide 02',
      title: 'Aerodynamic Upper & Midsole Suspension',
      desc: 'Lateral perspective highlighting multi-density foam suspension, seamless knit weave, and streamlined forward-propulsion geometry.',
      setting: 'Profile Angle & Studio Rim Light',
    },
    {
      act: 'Slide 03',
      title: 'Dynamic Cushioning & Sole Architecture',
      desc: 'High-angle perspective displaying kinetic shock-absorption chambers and structural energy-return sole lattice.',
      setting: 'Dynamic Perspective Staging',
    },
    {
      act: 'Slide 04',
      title: 'Engineered Mesh & Material Macro',
      desc: 'Macro shot accentuating breathable engineered mesh textures, reinforced TPU lace eyelets, and ergonomic tongue padding.',
      setting: 'Macro Texture & Material Staging',
    },
    {
      act: 'Slide 05',
      title: 'Outsole Grip & Flex Groove Geometry',
      desc: 'Underfoot perspective showcasing multidirectional rubber traction studs, water-dispersion siping channels, and flexible pivot points.',
      setting: 'Outsole Traction Geometry Setup',
    },
    {
      act: 'Slide 06',
      title: 'High-Contrast Studio Rim Staging',
      desc: 'Sculptural lighting environment casting dramatic rim highlights along the sole contours and heel collar.',
      setting: 'Chiaroscuro Studio Staging',
    },
    {
      act: 'Slide 07',
      title: 'Commercial Campaign Lookbook Finale',
      desc: 'Final high-conversion DTC e-commerce and commercial campaign showcase for the STRIDE SOLE brand launch.',
      setting: 'Commercial Campaign Master',
    },
  ],
  'jewellery-ads-01': [
    {
      act: 'Act 01',
      title: 'Royal Bridal Portrait & Emerald Choker Reveal',
      desc: 'Cinematic opening tracking shot of the Indian bridal model adorned in an opulent handcrafted 22K yellow gold choker with emerald green gemstone drops and royal bridal maang tikka.',
      setting: 'Royal Palatial Studio & Warm Amber Glow',
      time: 0,
    },
    {
      act: 'Act 02',
      title: 'Macro Emerald Refraction & Polki Diamonds',
      desc: 'High-precision macro portrait tracking capturing radiant emerald green gemstone droplets, Polki diamond reflections, and intricate gold filigree craftsmanship.',
      setting: 'Macro Gemstone Lighting & Rim Strobes',
      time: 3.5,
    },
    {
      act: 'Act 03',
      title: 'Bridal Maang Tikka & Emerald Drop Jhumkas',
      desc: 'Close-up perspective focusing on the delicate floral maang tikka forehead ornament and swinging pearl-and-emerald jhumka earrings in fluid motion.',
      setting: 'Bridal Profile Staging & Golden Rim Highlights',
      time: 7.2,
    },
    {
      act: 'Act 04',
      title: 'Warm Palatial Candlelight & Crimson Silk Ensemble',
      desc: 'Slow-motion portrait showcasing the rich contrast between deep crimson bridal silk, warm 22K yellow gold, and lustrous emerald green gems under candlelit aura.',
      setting: 'Palatial Crimson Velvet & Candlelight Caustics',
      time: 11.0,
    },
    {
      act: 'Act 05',
      title: 'Royal Emerald Luxury Campaign Finale',
      desc: 'High-impact luxury commercial ad finale highlighting bespoke Indian bridal heritage, authentic craftsmanship, and high-converting social reel presentation.',
      setting: 'Luxury Commercial Campaign Finale',
      time: 15.0,
    },
  ],
  'jewellery-ads-02': [
    {
      act: 'Slide 01',
      title: 'Hero Royal Azure Suite & Sunray Illumination',
      desc: 'Hero composition showcasing the complete royal blue sapphire & diamond jewellery suite (necklace, earrings, maang tikka, ring) illuminated by volumetric sunbeams across textured natural stone pedestals.',
      setting: 'Natural Stone Pedestal & Sunray Illumination',
    },
    {
      act: 'Slide 02',
      title: 'Sapphire Statement Choker on Mannequin Profile',
      desc: 'Ergonomic profile perspective of the royal blue sapphire choker draped on a minimalist mannequin bust, highlighting collarbone curvature, stone articulation, and pavé diamond halo prongs.',
      setting: 'Mannequin Bust Profile & Studio Rim Keylight',
    },
    {
      act: 'Slide 03',
      title: 'Chandelier Teardrop Earrings on Display Stand',
      desc: 'Profile silhouette of the matching blue sapphire chandelier teardrop earrings suspended from a minimalist brass studio holder, displaying balanced gemstone weight and delicate filigree links.',
      setting: 'Studio Earring Stand & Subtle Neutral Backdrop',
    },
    {
      act: 'Slide 04',
      title: '2K Macro Gemstone Facets & Diamond Halo',
      desc: 'Extreme 2K macro close-up revealing deep cobalt/royal blue sapphire crystalline clarity, light refraction, and micro-pavé diamond halo claw settings in pristine white-gold finish.',
      setting: '2K Macro Gemstone Refraction & Precision Lighting',
    },
    {
      act: 'Slide 05',
      title: 'Bridal Maang Tikka on Dedicated Stand',
      desc: 'High-definition studio presentation of the royal blue bridal maang tikka / matha patti forehead centerpiece displayed on a dedicated acrylic arch, highlighting delicate link chains and sapphire teardrop accents.',
      setting: 'Dedicated Jewelry Arch Stand & Focused Spot',
    },
    {
      act: 'Slide 06',
      title: 'Editorial Flat-Lay Arrangement on Natural Stone Slabs',
      desc: 'Editorial commercial flat-lay arrangement presenting the complete royal blue gemstone suite (choker, chandelier earrings, maang tikka, statement ring) artfully styled on textured slate stone slabs.',
      setting: 'Editorial Flat-Lay on Raw Mineral Stone Slabs',
    },
  ],
  'jewellery-ads-03': [
    {
      act: 'Slide 01',
      title: 'The Regal Frontal Portrait & Full Suite (Main Cover)',
      desc: 'Symmetrical medium portrait of the royal Indian muse in an off-shoulder emerald green velvet gown, showcasing the balanced bib-collar choker studded with uncut polki diamonds, emerald hearts, and hanging Basra pearls with matching chandelier drop earrings.',
      setting: 'Candlelit Palace Interior & Warm Chandelier Ambience',
    },
    {
      act: 'Slide 02',
      title: 'The Tactile Collarbone Touch & Artisan Weight',
      desc: 'Intimate medium-close composition where the muse gently graces the collarbone and central heart-motif emerald cluster, conveying substantial 22K gold weight, articulated flexibility, and hand-finished diamond claw prongs.',
      setting: 'Palace Suite & Soft Candlelight Rim Illumination',
    },
    {
      act: 'Slide 03',
      title: 'Side Profile Grace & Chandelier Earring Silhouette',
      desc: 'Sculptural profile angle highlighting the refined jawline and sleek low-bun chignon, framing the multi-tiered emerald teardrop earrings and the seamless ergonomic contour of the collar necklace clasp.',
      setting: 'Heritage Archway & Low-Angle Profile Keylight',
    },
    {
      act: 'Slide 04',
      title: 'Artisanal Macro & Hand-Held Chandelier Earring',
      desc: 'Extreme macro inspection shot with the model gently elevating the chandelier earring between her fingers, revealing fine filigree metalwork, closed-setting diamond mounts, and miniature articulated jump rings.',
      setting: 'Macro Studio Lighting & Diffused Golden Backlight',
    },
    {
      act: 'Slide 05',
      title: 'Palm-Cradled Earring Showcase & Scale Presentation',
      desc: 'Editorial product-focused capture displaying the chandelier earrings cradled openly in the model’s palm against draped golden silk fabric, emphasizing real scale, gemstone density, and natural pearl drops.',
      setting: 'Golden Silk Drapery & Diffused Studio Glow',
    },
    {
      act: 'Slide 06',
      title: 'The Luminous 3/4 Gaze & Palace Chandelier Ambiance',
      desc: 'Cinematic three-quarter over-the-shoulder angle capturing a contemplative expression as the bib collar catches directional key lighting against a backdrop of soft golden chandelier bokeh.',
      setting: 'Grand Palace Chamber & Gilded Crystal Chandelier Bokeh',
    },
    {
      act: 'Slide 07',
      title: 'The Adornment Ritual & Earring Adjustment',
      desc: 'Candid luxury moment capturing the muse adjusting the chandelier earring at the earlobe, demonstrating organic bridal wearability, balanced suspension, and comfortable weight distribution.',
      setting: 'Bridal Dressing Suite & Warm Directional Keylight',
    },
    {
      act: 'Slide 08',
      title: 'Décolletage Macro & Emerald Heart Centerpiece',
      desc: 'High-contrast macro crop centered on the breastplate and collarbone, focusing on the emerald heart center, alternating rows of uncut polki diamonds, and suspended Basra pearl fringe.',
      setting: 'Precision Macro Lens & Grazing Amber Edge Light',
    },
    {
      act: 'Slide 09',
      title: 'The Gilded Palace Vanity & Mirror Reflection',
      desc: 'Atmospheric narrative wide shot framing the muse before an ornate gold-leaf heritage mirror inside the royal suite, completing the luxury story of royal adornment and quiet sovereignty.',
      setting: 'Royal Palace Vanity & Ornate Gold-Leaf Mirror',
    },
  ],
  'product-ads-01': [
    {
      act: 'Act 01',
      title: 'STRIDE SOLE — Own Design Silhouette & Hero Orbit',
      desc: 'Frontal studio orbit reveal showcasing the original own-designed STRIDE SOLE silhouette, aerodynamic engineered knit upper, and electric neon contrast accents.',
      setting: 'STRIDE SOLE Studio Stage & High-Key Orbit Track',
      time: 0,
    },
    {
      act: 'Act 02',
      title: 'Macro Sole Tread & Multi-Density Outsole',
      desc: 'Precision macro tracking lens capturing STRIDE SOLE grip traction geometry, multidirectional flex grooves, and performance rubber compound details.',
      setting: 'Macro Outsole & Grip Geometry Stage',
      time: 8.0,
    },
    {
      act: 'Act 03',
      title: 'Kinetic Cushioning & Energy-Return Midsole',
      desc: 'Dynamic impact foam simulation visualizing rebound responsiveness, shock absorption chamber, and athletic step ergonomics for STRIDE SOLE.',
      setting: 'Kinetic Foam Physics & Stress Dispersion Lab',
      time: 18.0,
    },
    {
      act: 'Act 04',
      title: 'Ergonomic Heel Lockdown & TPU Support',
      desc: 'Sculpted 360-degree rotational angle highlighting the reinforced heel counter, adaptive arch support, and breathable seamless knit weave.',
      setting: '360° Structural Wireframe & Material Shading',
      time: 28.0,
    },
    {
      act: 'Act 05',
      title: 'STRIDE SOLE Campaign Shoot Finale & Brand CTA',
      desc: 'High-energy commercial closing reveal with dramatic rim lighting, STRIDE SOLE brand campaign callouts, and performance marketing conversion hook.',
      setting: 'Shoe Campaign Shoot Finale & Brand CTA',
      time: 36.0,
    },
  ],
  'product-ads-02': [
    {
      act: 'Act 01',
      title: 'The Crimson Dome Silhouette & Ambient Warmth',
      desc: 'Opening commercial reveal showcasing the modern fluted crimson dome table lamp casting a soft 2700K downward pool of ambient light against high-contrast navy studio staging.',
      setting: 'Minimalist Pedestal & Symmetrical Studio Keylight',
      time: 0,
    },
    {
      act: 'Act 02',
      title: 'Sculptural Organic Silhouette & Ceramic Glaze',
      desc: 'Fluid camera glide introducing the tall organic sculptural lamp silhouette, highlighting matte ceramic glaze and minimalist architectural presence.',
      setting: 'Architectural Alcove & Soft Directional Studio Fill',
      time: 4.5,
    },
    {
      act: 'Act 03',
      title: 'Tactile Brass Dimmer Rotary Adjustment',
      desc: 'Tactile close-up demonstration of smooth fingertip rotation on the solid knurled brass dimmer switch, showcasing continuous lux transition from ambient dusk to reading brightness.',
      setting: 'Macro Rotary Interaction Stage & Warm Keylight',
      time: 7.2,
    },
    {
      act: 'Act 04',
      title: 'Fluted Glass Texture & Amber Micro-Caustics',
      desc: 'Detailed cinematic macro revealing ribbed fluted glass texture and warm incandescent filament glow, emphasizing optical refinement and gentle shadow play.',
      setting: 'Precision Macro Rig & Amber Edge Illumination',
      time: 11.0,
    },
    {
      act: 'Act 05',
      title: 'Contemporary Luxury Suite & Atmospheric Harmony',
      desc: 'Aspirational wide-angle staging the designer ambient lamps within a contemporary luxury suite, reinforcing warm cozy luxury and functional mood enhancement.',
      setting: 'Luxury Suite Interior & Ambient Twilight Staging',
      time: 14.2,
    },
  ],
  'product-ads-03': [
    {
      act: 'Act 01',
      title: 'OLEVS Chrono Hero Staging & Velvet Cushion',
      desc: 'Opening hero presentation featuring the OLEVS hybrid luxury timepiece resting on a plush velvet presentation cushion, showcasing the unique fusion of polished walnut wood and black stainless steel.',
      setting: 'Horology Studio & Velvet Display Presentation Pillow',
      time: 0,
    },
    {
      act: 'Act 02',
      title: 'Handcrafted Walnut Bezel & Multi-Link Band',
      desc: 'Sweeping macro pan over the hand-finished natural grain walnut wood bezel and alternating wood-and-steel bracelet links, accentuating authentic timber warmth and metallic endurance.',
      setting: 'Natural Wood Grain Inspection Stage & Soft Studio Glow',
      time: 3.5,
    },
    {
      act: 'Act 03',
      title: 'Precision Chronograph Sub-Dials & Celestial Moonphase',
      desc: 'Macro close-up on the intricate multi-tiered black watch dial, highlighting the functional chronograph sub-dials, date aperture, gold Roman indices, and celestial moonphase disc.',
      setting: 'Macro Horology Rig & Directional Specular Reflection',
      time: 6.2,
    },
    {
      act: 'Act 04',
      title: 'Executive Wrist-Wear Lifestyle & Formal Suiting',
      desc: 'Cinematic dynamic transition showing the timepiece worn on an executive wrist paired with a crisp tailored shirt and suit trousers, demonstrating real-world versatility and prestige.',
      setting: 'Executive Office & Natural Window Keylight',
      time: 10.0,
    },
    {
      act: 'Act 05',
      title: 'Laser-Engraved Caseback & Mechanical Heritage',
      desc: 'Final slow-turn reveal displaying the laser-etched OLEVS crown crest caseback and butterfly deployant clasp, underscoring horological certification and durability.',
      setting: 'Rotating Jewel Turntable & Gilded Rim Illumination',
      time: 15.0,
    },
  ],
  'product-ads-04': [
    {
      act: 'Act 01',
      title: 'The Celestial Mist & Nocturnal Aperture',
      desc: 'Atmospheric cosmic opening where ethereal blue mist and water spirals part to reveal the iconic faceted silhouette of VELVENT REVERIA: Moonstone.',
      setting: 'Nocturnal Cosmic Void & Prismatic Particle Aperture',
      time: 0,
    },
    {
      act: 'Act 02',
      title: 'Ocean Surge Impact & Volcanic Coastal Rock',
      desc: 'Elemental commercial shot capturing turbulent coastal waves crashing violently against wet obsidian rocks around the anchored cobalt crystal fragrance bottle.',
      setting: 'Crashing Ocean Waves & Coastal Obsidian Rock',
      time: 3.8,
    },
    {
      act: 'Act 03',
      title: 'Faceted Cobalt Crystal & Diamond-Cut Flacon',
      desc: 'Hero center macro showcase revealing the geometric diamond-cut cobalt glass flacon, liquid fragrance caustics, and gold-embossed VELVENT REVERIA badge.',
      setting: 'Precision Studio Turntable & Deep Indigo Edge Light',
      time: 8.2,
    },
    {
      act: 'Act 04',
      title: 'Fluted Gold Stopper & Prismatic Light Refraction',
      desc: 'Intimate close-up emphasizing the heavy cylindrical fluted gold stopper catching directional amber and sapphire rim glints.',
      setting: 'Gilded Optical Caustic Chamber & Dual Rim Strobes',
      time: 13.5,
    },
    {
      act: 'Act 05',
      title: 'Nocturnal Supercar Elegance & Midnight Hold',
      desc: 'Cinematic nocturnal climax inside a luxury supercar cockpit, framing the protagonist holding the flacon against neon city lights and midnight leather upholstery.',
      setting: 'Luxury Supercar Cockpit & Ambient City Nocturne',
      time: 23.0,
    },
  ],
  'ugc-01': [
    {
      act: 'Act 01',
      title: 'Creator Hook: Photoshoot Cost Waste vs. AI Transformation',
      desc: 'High-energy direct-response opening confronting expensive photoshoot budgets — "Fashion photo shoot pe itna paisa kyon waste karna jab sab kuch AI se ho sakta hai?"',
      setting: 'Creator Workspace & High-Contrast Headline Subtitles',
      time: 0,
    },
    {
      act: 'Act 02',
      title: 'The Production Bottleneck: Models, Studios & Delays',
      desc: 'Highlighting the painful bottlenecks of traditional fashion shoots: high agency model fees, expensive studio rentals, and makeup artist scheduling delays.',
      setting: 'Traditional Shoot Frustration & Dynamic B-Roll Cutaways',
      time: 6.5,
    },
    {
      act: 'Act 03',
      title: 'Live Software Demonstration: Khatushyam Modeling Upload',
      desc: 'Live UI screen recording demonstrating how dragging a single raw garment photo into Khatushyam Modeling generates high-fashion virtual model poses in seconds.',
      setting: 'Khatushyam Modeling Platform UI & Single-Photo Drag-and-Drop',
      time: 14.0,
    },
    {
      act: 'Act 04',
      title: 'Multi-Look Catalog Generation: E-Commerce & Viral Reels',
      desc: 'Rapid lookbook generation revealing diverse editorial poses, lifestyle backgrounds, and social reel assets ready for instant e-commerce catalog publishing.',
      setting: 'AI Virtual Lookbook Grid & Multi-Angle Catalog View',
      time: 23.0,
    },
    {
      act: 'Act 05',
      title: 'Viral Performance & Low-Cost High-Conversion CTA',
      desc: 'Concluding performance breakdown proving how apparel brands achieve luxury-brand visual standards on a fraction of the budget with zero production delays.',
      setting: 'Creator Studio Conclusion & Direct Conversion Marketing CTA',
      time: 36.0,
    },
  ],
  'ugc-02': [
    {
      act: 'Act 01',
      title: 'Financial Hook: Why Spend Huge Budgets on Fashion Shoots?',
      desc: 'Direct-to-camera hook asking apparel founders why they waste capital on physical shoots when Glamolic AI delivers complete virtual photoshoots with one click.',
      setting: 'Modern Executive Studio Office & Direct-Response Hook',
      time: 0,
    },
    {
      act: 'Act 02',
      title: 'Traditional Photoshoot Overhead & Scheduling Friction',
      desc: 'Visual contrast breaking down multi-day photoshoot setup times, expensive camera gear, and crew logistics that drain startup apparel margins.',
      setting: 'Traditional Studio Setup Overhead & Pain-Point Narrative',
      time: 7.0,
    },
    {
      act: 'Act 03',
      title: 'Live Software Demonstration: Glamolic AI Virtual Studio',
      desc: 'Screen recording walk-through showcasing single-click garment upload into Glamolic AI, generating runway-ready model imagery and video variations within minutes.',
      setting: 'Glamolic AI Platform UI & 100% Progress Generation Sequence',
      time: 16.0,
    },
    {
      act: 'Act 04',
      title: 'Side-by-Side Comparison: Traditional Shoot vs. AI Generating',
      desc: 'Comparative infographic metric card contrasting "Traditional Shoot: High Cost & Days of Waiting" with "AI Generating: Low Budget & Instant Turnaround".',
      setting: 'Split-Screen Comparison Card & Cost-Efficiency Matrix',
      time: 28.0,
    },
    {
      act: 'Act 05',
      title: 'Official Website Call-To-Action: Visit www.glamolic.com',
      desc: 'Authoritative spokesperson closing affirming Glamolic AI as a game-changer for apparel labels, directing viewers to register on www.glamolic.com.',
      setting: 'Glamolic Brand Logo Callout & Official Website CTA',
      time: 46.0,
    },
  ],
  'campaign-01': [
    {
      act: 'Act 01',
      title: 'Fiery 3D Metallic Brand Intro: OVERLAYS Reveal',
      desc: 'High-impact explosive 3D metallic chrome logo reveal of "OVERLAYS — SINCE 2024 PREMIUM APPAREL" with electric particle energy.',
      setting: '3D Chrome & Fiery Ember Brand Portal Staging',
      time: 0,
    },
    {
      act: 'Act 02',
      title: 'Modern Brutalist Street Staging: Heavyweight Oversized Fit',
      desc: 'Seamless transition into live urban fashion modeling against an industrial brutalist concrete wall, highlighting drop shoulders and vivid sunset orange contrast.',
      setting: 'Industrial Architectural Concrete Wall & Natural Day Staging',
      time: 6.0,
    },
    {
      act: 'Act 03',
      title: 'Multi-Layered Editorial Motion: Picture-in-Picture Depth',
      desc: 'Dynamic split-screen and picture-in-picture editorial layout combining monochrome backdrop motion with vivid foreground garment textures and silver accessories.',
      setting: 'Minimalist White Tiled Studio Grid & Layered PIP Visuals',
      time: 15.0,
    },
    {
      act: 'Act 04',
      title: 'Kinetic Fabric Flow & Floating Silhouette Dynamics',
      desc: 'Zero-gravity floating apparel sequence illustrating 360-degree drape physics, structural boxy streetwear cut, and clean chest branding.',
      setting: 'Floating Studio Suspension & Fluid Camera Tracking',
      time: 30.0,
    },
    {
      act: 'Act 05',
      title: 'Studio Lookbook Flat-Lay & AI Creation Signature Outro',
      desc: 'Artisanal wooden flat-lay styling transitioning into the signature metallic AI Creation outro emblem, leaving an authoritative digital brand mark.',
      setting: 'Curated Hardwood Studio Flat-Lay & AI Creation Signature',
      time: 40.0,
    },
  ],
  'campaign-02': [
    {
      act: 'Act 01',
      title: 'The Horological Shimmer: Sunburst Ruby Red Dial & Fluted Gold Bezel',
      desc: 'Macro cinema lighting sweeping across the deep crimson sunray dial, gold Roman numerals, Day-Date aperture, and light-catching fluted bezel.',
      setting: 'Macro Horology Studio with Directional Amber Keylights',
      time: 0,
    },
    {
      act: 'Act 02',
      title: 'Presidential Bracelet Architecture & Polished Link Reflections',
      desc: 'Extreme macro dolly shot capturing the brushed and polished contrast of the 3-piece presidential gold bracelet and seamless crown clasp.',
      setting: 'Warm Mahogany Wood Backdrop & Studio Specular Reflection',
      time: 4.5,
    },
    {
      act: 'Act 03',
      title: 'The Curator Presentation: Walnut Display Box Staging',
      desc: 'The timepiece resting on a plush display cushion within an heirloom polished wooden presentation case in an executive library setting.',
      setting: 'Executive Library with Floor-to-Ceiling Leather-Bound Books',
      time: 8.5,
    },
    {
      act: 'Act 04',
      title: 'The Suited Selection: Executive Hand Handling & Inspection',
      desc: 'A tailored executive in a charcoal wool suit retrieving the Limestone Day Date, inspecting the precision movement and gold link tactile balance.',
      setting: 'Private Study Dressing Suite with Warm Architectural Sconces',
      time: 13.0,
    },
    {
      act: 'Act 05',
      title: 'The Executive Statement: Wrist Fastening & Cuff Elegance',
      desc: 'First-person perspective of the timepiece fastened securely on the wrist against a crisp white shirt cuff and tailored jacket, concluding the ritual of luxury.',
      setting: 'Executive First-Person Perspective & Tailored Wool Cuff Staging',
      time: 16.5,
    },
  ],
  'video-01': [
    {
      act: 'Act 01',
      title: 'The Asuric Sovereign — Throne of Hiranyakashipu',
      desc: 'The tyrannical demon king Hiranyakashipu sits in sinister majesty upon his monolithic obsidian throne. Bathed in burning ember light, deep crimsons, and apocalyptic shadows, his gaze radiates invincible pride and demonic dominion over the cosmos.',
      setting: 'Asuric Monolithic Throne Room & Volcanic Ember Glow',
    },
    {
      act: 'Act 02',
      title: 'The Child of Unshakable Faith — Prahlad’s Meditation',
      desc: 'In tranquil defiance of palace tyranny, young devotee Prahlad sits in serene Padmasana prayer. His folded hands and peaceful aura manifest the radiant golden Sanskrit mantra "Om Namo Bhagavate Vasudevaya", channeling transcendent divine protection.',
      setting: 'Palace Colonnade & Celestial Mantra Illumination',
    },
    {
      act: 'Act 03',
      title: 'Wrath of Adharma — The Swelling Spectral Fury',
      desc: 'Blinded by ego and celestial boons, King Hiranyakashipu erupts in volcanic fury. Towering spectral shadows and swirling ash particles engulf the imperial hall as the demon king refuses to accept any power higher than his own sovereign will.',
      setting: 'Imperial Hall of Shadows & Swirling Ash Storm',
    },
    {
      act: 'Act 04',
      title: 'The Challenge of Truth — Striking the Royal Pillar',
      desc: 'With drawn blade and electric violet lightning flashing across dark architecture, Hiranyakashipu mocks his son, striking the monumental stone pillar (Stambha) with furious defiance: "If your Vishnu is everywhere, is He inside this pillar?!" Young Prahlad stands steadfast in unwavering prayer.',
      setting: 'Royal Sanctum of the Stambha & Violet Electric Arcs',
    },
    {
      act: 'Act 05',
      title: 'The Pillar Shatters — Manifestation from the Stone',
      desc: 'Inside the fracturing royal court, the monumental pillar bursts open with blinding celestial light and glowing embers. Lord Narasimha thunders forth from the shattered stone to confront King Hiranyakashipu, as young Prahlad kneels in awe and unbroken prayer.',
      setting: 'Shattered Monolithic Pillar & Roar of Divine Intervention',
    },
    {
      act: 'Act 06',
      title: 'Manifestation of Narasimha — Twilight at the Threshold',
      desc: 'At dusk, neither day nor night, upon the palace doorway threshold—neither indoors nor out—Lord Narasimha emerges. The ferocious man-lion avatar of Bhagavan Vishnu places the demon king upon His lap, vanquishing adharma with divine claws without violating Brahma’s boons, while Prahlad folds his hands in divine awe.',
      setting: 'Palace Threshold at Twilight & Divine Manifestation',
    },
    {
      act: 'Act 07',
      title: 'Divine Pacification — Lord Narasimha Embraces Prahlad',
      desc: 'The terrifying cosmic wrath softens into boundless maternal tenderness (Vatsalya Bhava). Bathed in warm golden sunlight and showering pink lotus petals, Lord Narasimha gently embraces the pure child-devotee, bestowing eternal divine protection and supreme liberation (Moksha).',
      setting: 'Sanctified Hall bathed in Falling Lotus Petals & Golden Sun',
    },
    {
      act: 'Act 08',
      title: 'Coronation of Dharma — The Supreme Blessing',
      desc: 'Lord Narasimha is enthroned in supreme majesty, raising His golden hand in the eternal Abhayamudrā of fearlessness. Prahlad bows in deep reverence before the Avatar, inaugurating a golden era of righteous spiritual consciousness and devotion.',
      setting: 'Celestial Throne of Dharma & Transcendental Aura',
    },
  ],
  'video-02': [
    {
      act: 'Act 01',
      title: 'Court of the Asura: Hiranyakashipu’s Obsidian Throne',
      desc: 'The tyrannical demon king presides in dark majestic arrogance upon his monolithic obsidian throne, surrounded by burning embers, as young Prahlad kneels in steadfast meditative surrender.',
      setting: 'Imperial Hall of Asuric Dominion & Glowing Embers',
      time: 0,
    },
    {
      act: 'Act 02',
      title: 'The Child’s Unshakable Devotion: The Threat of the Blade',
      desc: 'Enraged by his son’s transcendental devotion to Bhagavan Vishnu, Hiranyakashipu draws his blade to execute Prahlad, demanding where this omnipresent God hides.',
      setting: 'Palace Colonnade & Impending Execution',
      time: 8.5,
    },
    {
      act: 'Act 03',
      title: 'Cosmic Rupture: The Royal Pillar Splits Asunder',
      desc: 'The demon king strikes the central stone pillar in mocking fury. Electric purple and celestial golden lightning surges through the architecture as the pillar shatters outward in a deafening thunderclap.',
      setting: 'Fracturing Monolithic Stambha & Dimensional Lightning',
      time: 17.0,
    },
    {
      act: 'Act 04',
      title: 'Ugra Narasimha Roar: Divine Manifestation at Twilight',
      desc: 'Roaring with cosmic majesty, Lord Narasimha emerges from the shattered pillar—neither beast nor man, appearing at dusk upon the doorway threshold to uphold every celestial condition while dispensing absolute cosmic justice.',
      setting: 'Threshold at Dusk & The Roaring Man-Lion Avatar',
      time: 26.5,
    },
    {
      act: 'Act 05',
      title: 'Vanquishing Adharma: Prahlad’s Divine Liberation',
      desc: 'The ferocious divine form vanquishes the tyrant king upon His lap, turning His gaze of boundless grace toward young Prahlad who bows with folded hands in tears of spiritual ecstasy and eternal liberation (Moksha).',
      setting: 'Sanctified Hall & Transcendent Golden Aura',
      time: 36.0,
    },
  ],
  'video-03': [
    {
      act: 'Act 01',
      title: 'The Great Rift: Pixel to Reality Convergence',
      desc: 'A split-dimensional anomaly tears through cosmic space: on the left, the classic stylized Minecraft universe; on the right, a blinding golden rift piercing the fabric of our realistic human world as Steve and Alex cross over.',
      setting: 'Interdimensional Boundary & Blinding Golden Vortex',
    },
    {
      act: 'Act 02',
      title: 'Arrival in the Overworld: The Medieval Frontier',
      desc: 'Steve and Alex, manifested as living human explorers in rugged travel garb, wander through a lush alpine settlement flanked by colossal stone Iron Golems standing silent watch beneath golden-hour skies.',
      setting: 'Living Medieval Timber Village & Alpine Forest',
    },
    {
      act: 'Act 03',
      title: 'The Forbidden Ruins: Subterranean Runes',
      desc: 'Accompanied by their faithful wolf and horse companions, the human heroes descend into ancient moss-covered subterranean catacombs, discovering glowing purple runes pulsating beneath bedrock.',
      setting: 'Ancient Overgrown Chasm & Glowing Runestones',
    },
    {
      act: 'Act 04',
      title: 'Igniting the Obsidian Gate: Nether Vortex Awakens',
      desc: 'Within a cavernous underground chamber, the monumental obsidian frame is struck with lightning. A swirling violet vortex tears through reality, flooding the dark chamber in ominous purple radiation.',
      setting: 'Subterranean Obsidian Portal & Swirling Violet Gateway',
    },
    {
      act: 'Act 05',
      title: 'Descent of the Titan: The Ender Dragon Siege',
      desc: 'The skies turn apocalyptic as storm clouds swirl violet and black. The colossal Ender Dragon breaches into the human skies, unleashing streams of lethal purple plasma that engulf village rooftops in flames as villagers flee.',
      setting: 'Catastrophic Storm Sky & Burning Settlement',
    },
    {
      act: 'Act 06',
      title: 'Vanguard of Humanity: Heroes Rally for War',
      desc: 'Dwarfed by the colossal shadow of the skyborne titan, Steve raises his reinforced shield and Alex draws her bow. Silhouetted against the burning skyline, they stand as humanity’s brave defense.',
      setting: 'Burning Village Ridge & Apocalyptic Silhouette',
    },
    {
      act: 'Act 07',
      title: 'Kinetic Aerial Clash: Deflecting the Dragonfire',
      desc: 'In an adrenaline-fueled mid-air clash, Steve leaps to deflect a blast of purple dragon-plasma with his radiant shield while Alex executes a gravity-defying aerial strike with pinpoint precision.',
      setting: 'Mid-Air Battlefield & Radiant Energy Shield Deflection',
    },
    {
      act: 'Act 08',
      title: 'Dawn of Peace: Sanctuary Reclaimed',
      desc: 'The apocalyptic threat vanquished, radiant golden sunlight washes across the restored settlement. Steve, Alex, grateful villagers, and stalwart Iron Golems celebrate the survival and rebirth of humanity’s new world.',
      setting: 'Sunlit Village Square & Reborn Human Sanctuary',
    },
  ],
  'video-04': [
    {
      act: 'Act 01',
      title: 'Initializing the Real World: The Photorealistic Biome',
      desc: 'The legendary MINECRAFT interface loads over an awe-inspiring, hyper-realistic mountain wilderness with cascading waterfalls and ancient pine forests, reimagining voxel landscapes into cinematic realism.',
      setting: 'Misty Alpine Mountain Biome & AAA Cinematic Engine',
      time: 0,
    },
    {
      act: 'Act 02',
      title: 'The Human Frontier: Medieval Timber Village & Explorers',
      desc: 'Live-action human explorers—cinematic Steve and Alex—navigate a bustling medieval timber settlement, wandering through stone archways and overgrown jungle temple ruins among realistic human villagers.',
      setting: 'Living Medieval Settlement & Overgrown Jungle Ruins',
      time: 10.0,
    },
    {
      act: 'Act 03',
      title: 'Nether Incursion: Obsidian Obelisks & Dimensional Rifts',
      desc: 'The sky darkens ominously as violent lightning strikes towering obsidian monoliths topped with pulsating purple cube matrices, tearing open dimensional rifts between realms.',
      setting: 'Storm-Lashed Dimensional Rift & Obsidian Monoliths',
      time: 22.0,
    },
    {
      act: 'Act 04',
      title: 'The Ender Dragon Siege: Skyborne Purple Firestorm',
      desc: 'A colossal, menacing black dragon descends from the vortex, unleashing furious streams of glowing purple plasma breath that engulf the village rooftops in apocalyptic flames as terrified villagers flee.',
      setting: 'Burning Village Rooftops & Colossal Dragon Assault',
      time: 35.0,
    },
    {
      act: 'Act 05',
      title: 'Forged for Survival: Enchanted Crystal Battle Armor',
      desc: 'Rising to defend human civilization, the female warrior equips glowing blue crystal-infused enchanted armor, rallying weapons to confront the skyborne titan in an epic stand of mortal courage.',
      setting: 'Smoldering Town Square & Glowing Enchanted Armor',
      time: 48.0,
    },
    {
      act: 'Act 06',
      title: 'Dawn of Sanctuary: Iron Golem Guardians at Sunset',
      desc: 'With the cataclysm averted, warm golden sunset bathes the peaceful settlement. The heroic explorers stand victorious alongside towering stone Iron Golems, securing the dawn of a rebuilt human world.',
      setting: 'Peaceful Village at Sunset with Guardian Golems',
      time: 58.0,
    },
  ],
};

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  allProjects,
  categoryInfo,
  isOpen,
  onClose,
  onSelectProject,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [direction, setDirection] = useState<number>(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(19);
  const [mediaViewMode, setMediaViewMode] = useState<'video' | 'gallery'>('video');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isVideoFullscreen, setIsVideoFullscreen] = useState(false);
  const [fitMode, setFitMode] = useState<'contain' | 'cover'>('contain');
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [displayTab, setDisplayTab] = useState<'all' | 'brief' | 'storyboard' | 'specs'>('all');
  const [briefExpanded, setBriefExpanded] = useState<boolean>(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const triggerFeedback = (text: string) => {
    setActionFeedback(text);
    setTimeout(() => setActionFeedback(null), 1200);
  };

  useEffect(() => {
    if (project) {
      setSelectedImage(project.imageUrl);
      setDirection(0);
      setIsPlaying(true);
      setCurrentTime(0);
      setIsLightboxOpen(false);
      setIsVideoFullscreen(false);
      setIsMuted(true);
      setPlaybackRate(1);
      setDisplayTab('all');
      setBriefExpanded(false);
      setCopiedLink(false);

      // Dispatch event to pause & mute any background card players immediately
      window.dispatchEvent(new CustomEvent('portfolio-modal-open'));

      const hasVid =
        (project.videoUrl &&
          project.videoUrl.trim() !== '' &&
          !project.videoUrl.includes('PASTE_VIDEO_URL') &&
          !project.videoUrl.includes('PASTE_REEL_URL')) ||
        (project.reelUrl &&
          project.reelUrl.trim() !== '' &&
          !project.reelUrl.includes('PASTE_REEL_URL'));

      setMediaViewMode(hasVid ? 'video' : 'gallery');
    }
  }, [project]);

  // Keyboard navigation for lightbox, video fullscreen & modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        if (isVideoFullscreen) {
          setIsVideoFullscreen(false);
        } else if (isLightboxOpen) {
          setIsLightboxOpen(false);
        } else {
          onClose();
        }
      } else if (e.key === ' ' && (hasVideo && mediaViewMode === 'video')) {
        e.preventDefault();
        handleTogglePlayPause();
      } else if ((e.key === 'm' || e.key === 'M') && (hasVideo && mediaViewMode === 'video')) {
        setIsMuted((prev) => !prev);
      } else if ((e.key === 'f' || e.key === 'F') && (hasVideo && mediaViewMode === 'video')) {
        setIsVideoFullscreen((prev) => !prev);
      } else if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLightboxOpen, isVideoFullscreen, onClose, selectedImage, mediaViewMode, isPlaying]);

  if (!project || !isOpen) return null;

  // Filter projects within same category for next/prev navigation
  const categoryProjects = allProjects.filter(
    (p) => p.category === project.category && p.visible
  );
  const currentIndex = categoryProjects.findIndex((p) => p.id === project.id);
  const prevProject =
    currentIndex > 0 ? categoryProjects[currentIndex - 1] : categoryProjects[categoryProjects.length - 1];
  const nextProject =
    currentIndex < categoryProjects.length - 1 ? categoryProjects[currentIndex + 1] : categoryProjects[0];

  const hasVideo =
    (project.videoUrl &&
      project.videoUrl.trim() !== '' &&
      !project.videoUrl.includes('PASTE_VIDEO_URL') &&
      !project.videoUrl.includes('PASTE_REEL_URL')) ||
    (project.reelUrl &&
      project.reelUrl.trim() !== '' &&
      !project.reelUrl.includes('PASTE_REEL_URL'));

  const videoSource = project.videoUrl || project.reelUrl;

  const galleryImages = [
    project.imageUrl,
    ...(project.additionalImages || []),
  ].filter(
    (img) =>
      img &&
      img.trim() !== '' &&
      !img.includes('PASTE_IMAGE_URL') &&
      !img.includes('PASTE_THUMBNAIL_URL')
  );

  const currentGalleryIndex = Math.max(0, galleryImages.indexOf(selectedImage));

  const handlePrevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (galleryImages.length <= 1) return;
    setDirection(-1);
    const prevIdx = currentGalleryIndex > 0 ? currentGalleryIndex - 1 : galleryImages.length - 1;
    setSelectedImage(galleryImages[prevIdx]);
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (galleryImages.length <= 1) return;
    setDirection(1);
    const nextIdx = currentGalleryIndex < galleryImages.length - 1 ? currentGalleryIndex + 1 : 0;
    setSelectedImage(galleryImages[nextIdx]);
  };

  const handleSelectImage = (img: string, idx: number) => {
    setDirection(idx > currentGalleryIndex ? 1 : -1);
    setSelectedImage(img);
  };

  // Slide animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 260 : dir < 0 ? -260 : 0,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 320, damping: 32 },
        opacity: { duration: 0.28 },
        scale: { duration: 0.28 },
      },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 260 : -260,
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: 'spring' as const, stiffness: 320, damping: 32 },
        opacity: { duration: 0.22 },
      },
    }),
  };

  const activeScene =
    PROJECT_SCENES_MAP[project.id]?.[currentGalleryIndex] || null;

  const projectScenes = PROJECT_SCENES_MAP[project.id] || null;

  const connectedProjectId =
    project.id === 'video-01'
      ? 'video-02'
      : project.id === 'video-02'
      ? 'video-01'
      : project.id === 'video-03'
      ? 'video-04'
      : project.id === 'video-04'
      ? 'video-03'
      : null;

  const connectedProject =
    connectedProjectId && allProjects
      ? allProjects.find((p) => p.id === connectedProjectId) || null
      : null;

  const handleVideoSeek = (timeSec: number) => {
    const vid = document.getElementById('project-detail-video') as HTMLVideoElement;
    if (vid) {
      vid.currentTime = timeSec;
      setCurrentTime(timeSec);
      if (!isPlaying) {
        vid.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const handleSeekRelative = (delta: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const vid = document.getElementById('project-detail-video') as HTMLVideoElement;
    if (vid) {
      const maxDur = vid.duration || duration || 20;
      const targetTime = Math.max(0, Math.min(maxDur, vid.currentTime + delta));
      vid.currentTime = targetTime;
      setCurrentTime(targetTime);
      triggerFeedback(delta > 0 ? `+${delta}s` : `${delta}s`);
      if (!isPlaying) {
        vid.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const handleChangeSpeed = (speed: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPlaybackRate(speed);
    const vid = document.getElementById('project-detail-video') as HTMLVideoElement;
    if (vid) {
      vid.playbackRate = speed;
    }
    const fsVid = document.getElementById('fullscreen-reel-video') as HTMLVideoElement;
    if (fsVid) {
      fsVid.playbackRate = speed;
    }
    triggerFeedback(`${speed}x Speed`);
  };

  const handleTogglePlayPause = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const vid = document.getElementById('project-detail-video') as HTMLVideoElement;
    if (vid) {
      if (!vid.paused) {
        vid.pause();
        setIsPlaying(false);
        triggerFeedback('PAUSED');
      } else {
        vid.play().catch(() => {});
        setIsPlaying(true);
        triggerFeedback('PLAYING');
      }
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  const handleToggleModalSound = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    const vid = document.getElementById('project-detail-video') as HTMLVideoElement;
    if (vid) {
      vid.muted = nextMuted;
      vid.volume = 1.0;
    }
    const fsVid = document.getElementById('fullscreen-reel-video') as HTMLVideoElement;
    if (fsVid) {
      fsVid.muted = nextMuted;
      fsVid.volume = 1.0;
    }
    if (!nextMuted && project) {
      window.dispatchEvent(
        new CustomEvent('portfolio-audio-play', { detail: { id: `modal-${project.id}` } })
      );
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-2xl flex flex-col justify-start">
        {/* Sticky Detail Top Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-30 bg-[#080A10]/95 backdrop-blur-md border-b border-[#1A1E2C] px-6 md:px-12 py-4 flex items-center justify-between"
        >
          {/* Back button */}
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-[#9295A0] hover:text-[#F5F3EE] font-['IBM_Plex_Mono'] text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO CATEGORY</span>
          </button>

          {/* Navigation between projects */}
          <div className="hidden sm:flex items-center gap-4">
            <button
              onClick={() => prevProject && onSelectProject(prevProject)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#121520] hover:bg-[#1C2030] text-[#9295A0] hover:text-[#F5F3EE] font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>PREV PROJECT</span>
            </button>

            <span className="font-['IBM_Plex_Mono'] text-xs text-[#636878]">
              {currentIndex + 1} / {categoryProjects.length}
            </span>

            <button
              onClick={() => nextProject && onSelectProject(nextProject)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#121520] hover:bg-[#1C2030] text-[#9295A0] hover:text-[#F5F3EE] font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
            >
              <span>NEXT PROJECT</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#121520] hover:bg-[#1C2030] text-[#9295A0] hover:text-white transition-colors cursor-pointer"
            aria-label="Close project details"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Modal Main Content Container */}
        <div className="max-w-6xl mx-auto w-full px-6 md:px-12 py-8 md:py-12 pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left/Main Column: Interactive Visual Stage & Slider */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Media Switcher Tab (If both video and gallery images exist) */}
              {hasVideo && galleryImages.length > 0 && (
                <div className="flex items-center justify-between p-1.5 rounded-2xl bg-[#0C0E17] border border-[#1C2133]">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setMediaViewMode('video')}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-['IBM_Plex_Mono'] text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                        mediaViewMode === 'video'
                          ? 'bg-[#00FF87] text-black shadow-md shadow-[#00FF87]/20'
                          : 'text-[#9295A0] hover:text-white hover:bg-[#151926]'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>1080p Video Reel</span>
                    </button>

                    <button
                      onClick={() => setMediaViewMode('gallery')}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-['IBM_Plex_Mono'] text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                        mediaViewMode === 'gallery'
                          ? 'bg-[#00FF87] text-black shadow-md shadow-[#00FF87]/20'
                          : 'text-[#9295A0] hover:text-white hover:bg-[#151926]'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Visual Slides ({galleryImages.length})</span>
                    </button>
                  </div>

                  <span className="hidden sm:inline font-['IBM_Plex_Mono'] text-[10px] text-[#00FF87] font-semibold px-2.5 py-1 rounded-md bg-[#121622] border border-[#20273A]">
                    {mediaViewMode === 'video' ? '1080P HD • NO BLUR' : 'ULTRA HIGH-RES'}
                  </span>
                </div>
              )}

              {/* Active Visual Scene Pill (If in gallery mode and scene exists) */}
              {mediaViewMode === 'gallery' && activeScene && (
                <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#0F131E] border border-[#1E2436] text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-['IBM_Plex_Mono'] text-[10px] font-bold bg-[#00FF87]/20 text-[#00FF87] border border-[#00FF87]/30">
                      {activeScene.act}
                    </span>
                    <span className="font-['Space_Grotesk'] font-bold text-[#F5F3EE]">
                      {activeScene.title}
                    </span>
                  </div>
                  <span className="font-['IBM_Plex_Mono'] text-[10.5px] text-[#868A9A]">
                    {currentGalleryIndex + 1} of {galleryImages.length}
                  </span>
                </div>
              )}

              {/* Media Viewport */}
              <div
                className={`relative w-full rounded-3xl overflow-hidden bg-[#07080E] border border-[#1E2336] shadow-2xl flex items-center justify-center select-none group/stage ${
                  hasVideo && mediaViewMode === 'video'
                    ? 'aspect-[9/16] max-h-[72vh] sm:max-h-[76vh] max-w-[420px] mx-auto min-h-[460px]'
                    : 'min-h-[420px] sm:min-h-[500px] md:min-h-[580px]'
                }`}
              >
                {hasVideo && mediaViewMode === 'video' ? (
                  <div
                    onClick={handleTogglePlayPause}
                    className="relative w-full h-full flex flex-col justify-center items-center bg-[#05060A] cursor-pointer"
                  >
                    {/* Cover image overlay displayed when video is idle or paused */}
                    <img
                      src={
                        project.id === 'jewellery-ads-01'
                          ? '/images/postimg/93b3f9a9-635f-4ea5-869c-2674821667e0.webp'
                          : project.thumbnailUrl && project.thumbnailUrl.trim() !== ''
                          ? project.thumbnailUrl
                          : project.imageUrl
                      }
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className={`absolute inset-0 w-full h-full object-cover rounded-2xl transition-opacity duration-300 pointer-events-none ${
                        isPlaying ? 'opacity-0 z-0' : 'opacity-100 z-10'
                      }`}
                    />

                    {/* The Video Element — Covering the frame cleanly */}
                    <video
                      id="project-detail-video"
                      src={`${videoSource}#t=0.001`}
                      autoPlay
                      loop
                      muted={isMuted}
                      playsInline
                      preload="auto"
                      poster={
                        project.id === 'jewellery-ads-01'
                          ? '/images/postimg/93b3f9a9-635f-4ea5-869c-2674821667e0.webp'
                          : project.thumbnailUrl && project.thumbnailUrl.trim() !== ''
                          ? project.thumbnailUrl
                          : undefined
                      }
                      onTimeUpdate={(e) => {
                        const target = e.currentTarget;
                        setCurrentTime(target.currentTime);
                        if (target.duration && !isNaN(target.duration)) {
                          setDuration(target.duration);
                        }
                      }}
                      onLoadedMetadata={(e) => {
                        const target = e.currentTarget;
                        if (target.duration && !isNaN(target.duration)) {
                          setDuration(target.duration);
                        }
                      }}
                      className={`w-full h-full object-cover rounded-2xl cursor-pointer transition-opacity duration-300 ${
                        !isPlaying ? 'opacity-0 z-0' : 'opacity-100 z-10'
                      }`}
                    />

                    {/* Big Center Play/Pause Overlay Indicator on Hover or when Paused (Distinct Color: Amber-Gold) */}
                    <div
                      className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300 ${
                        !isPlaying
                          ? 'opacity-100 bg-black/45 backdrop-blur-xs'
                          : 'opacity-0 hover:opacity-100 hover:bg-black/20'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2.5">
                        <div className="flex items-center gap-4 pointer-events-auto">
                          {/* Quick Rewind 5s */}
                          <button
                            onClick={(e) => handleSeekRelative(-5, e)}
                            className="w-11 h-11 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 hover:border-[#FFB800] flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer font-['IBM_Plex_Mono'] text-xs font-bold"
                            title="Rewind 5 Seconds"
                          >
                            -5s
                          </button>

                          {/* Big Main Play/Pause Button */}
                          <button
                            onClick={handleTogglePlayPause}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FFB800] hover:bg-[#FFC933] text-black border-2 border-black/20 flex items-center justify-center shadow-[0_0_35px_rgba(255,184,0,0.75)] hover:scale-110 active:scale-95 transition-all cursor-pointer"
                            title={isPlaying ? 'Click to Pause Video' : 'Click to Play Video'}
                          >
                            {isPlaying ? (
                              <Pause className="w-8 h-8 fill-current text-black" />
                            ) : (
                              <Play className="w-8 h-8 fill-current text-black ml-1" />
                            )}
                          </button>

                          {/* Quick Forward 5s */}
                          <button
                            onClick={(e) => handleSeekRelative(5, e)}
                            className="w-11 h-11 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 hover:border-[#FFB800] flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer font-['IBM_Plex_Mono'] text-xs font-bold"
                            title="Forward 5 Seconds"
                          >
                            +5s
                          </button>
                        </div>

                        {!isPlaying ? (
                          <span className="font-['IBM_Plex_Mono'] text-[10px] uppercase font-bold tracking-widest text-[#FFB800] bg-black/85 px-3.5 py-1 rounded-full border border-[#FFB800]/40 shadow-lg animate-pulse">
                            PAUSED • TAP TO PLAY
                          </span>
                        ) : (
                          <span className="font-['IBM_Plex_Mono'] text-[10px] uppercase font-bold tracking-widest text-[#00FF87] bg-black/85 px-3 py-1 rounded-full border border-[#00FF87]/40 shadow-lg opacity-0 group-hover/stage:opacity-100 transition-opacity">
                            PLAYING • TAP TO PAUSE
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Temporary Floating Action Notification Toast */}
                    {actionFeedback && (
                      <div className="absolute top-16 inset-x-0 flex justify-center z-30 pointer-events-none">
                        <span className="px-4 py-1.5 rounded-full bg-[#FFB800] text-black font-['IBM_Plex_Mono'] text-xs font-extrabold tracking-wider shadow-2xl animate-bounce">
                          {actionFeedback}
                        </span>
                      </div>
                    )}

                    {/* Top Video Clarity, Sound Status & Fullscreen Button */}
                    <div className="absolute top-3 inset-x-3 sm:top-4 sm:inset-x-4 z-20 flex items-center justify-between pointer-events-none">
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-white font-['IBM_Plex_Mono'] text-[10px] font-bold uppercase tracking-wider shadow-lg">
                        <span className="w-2 h-2 rounded-full bg-[#00FF87] animate-pulse" />
                        <span>1080P MASTER</span>
                      </span>

                      {/* Top Corner Action Controls */}
                      <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
                        {/* Speed Cycle Button */}
                        <button
                          onClick={(e) => {
                            const nextSpeed = playbackRate === 1 ? 1.25 : playbackRate === 1.25 ? 1.5 : playbackRate === 1.5 ? 0.75 : 1;
                            handleChangeSpeed(nextSpeed, e);
                          }}
                          className="px-2.5 py-1.5 rounded-full bg-black/85 hover:bg-[#161B28] backdrop-blur-md border border-white/20 hover:border-[#FFB800] text-[#FFB800] font-['IBM_Plex_Mono'] text-[10.5px] uppercase font-bold tracking-wider transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
                          title="Change Playback Speed"
                        >
                          {playbackRate}x
                        </button>

                        {/* Sound on/off button at corner */}
                        <button
                          onClick={handleToggleModalSound}
                          className="px-3 py-1.5 rounded-full bg-black/85 hover:bg-[#161B28] backdrop-blur-md border border-white/20 hover:border-white/40 text-white font-['IBM_Plex_Mono'] text-[10.5px] uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
                          title={isMuted ? 'Turn Sound On' : 'Turn Sound Off'}
                        >
                          {isMuted ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 text-[#FF6B6B]" />
                              <span>Sound OFF</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5 text-[#00FF87]" />
                              <span>Sound ON</span>
                            </>
                          )}
                        </button>

                        {/* Full screen button at corner */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsVideoFullscreen(true);
                          }}
                          className="p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-black/85 hover:bg-[#FFB800] hover:text-black backdrop-blur-md border border-white/20 hover:border-[#FFB800] text-white font-['IBM_Plex_Mono'] text-[10.5px] uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
                          title="Open Full Screen View"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Full Screen</span>
                        </button>
                      </div>
                    </div>

                    {/* Video Player Bottom Controls Overlay */}
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute bottom-3 inset-x-3 sm:inset-x-4 z-20 p-3 rounded-2xl bg-black/85 backdrop-blur-xl border border-white/15 text-white shadow-2xl space-y-2"
                    >
                      {/* Scrubber Progress Bar */}
                      <div
                        className="relative w-full h-2.5 rounded-full bg-white/20 overflow-hidden cursor-pointer group/scrub"
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const pos = (e.clientX - rect.left) / rect.width;
                          handleVideoSeek(pos * duration);
                        }}
                      >
                        <div
                          className="h-full bg-gradient-to-r from-[#FFB800] to-[#00FF87] rounded-full transition-all duration-100"
                          style={{
                            width: `${(currentTime / Math.max(1, duration)) * 100}%`,
                          }}
                        />
                      </div>

                      {/* Control Buttons Row */}
                      <div className="flex items-center justify-between gap-2">
                        {/* Play/Pause Button & Seek Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            id="video-play-pause-btn"
                            onClick={handleTogglePlayPause}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFB800] hover:bg-[#FFC933] text-black font-['IBM_Plex_Mono'] text-xs font-bold uppercase tracking-wider transition-transform active:scale-95 cursor-pointer shadow-md shadow-[#FFB800]/25"
                            title={isPlaying ? 'Pause Video' : 'Play Video'}
                          >
                            {isPlaying ? (
                              <>
                                <Pause className="w-3.5 h-3.5 fill-current" />
                                <span>Pause</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>Play</span>
                              </>
                            )}
                          </button>

                          {/* -5s and +5s Seek Buttons */}
                          <button
                            onClick={(e) => handleSeekRelative(-5, e)}
                            className="p-1.5 rounded-lg bg-[#151926] hover:bg-[#20273A] text-[#9295A0] hover:text-white font-['IBM_Plex_Mono'] text-[10px] font-bold transition-colors cursor-pointer"
                            title="Rewind 5s"
                          >
                            -5s
                          </button>
                          <button
                            onClick={(e) => handleSeekRelative(5, e)}
                            className="p-1.5 rounded-lg bg-[#151926] hover:bg-[#20273A] text-[#9295A0] hover:text-white font-['IBM_Plex_Mono'] text-[10px] font-bold transition-colors cursor-pointer"
                            title="Forward 5s"
                          >
                            +5s
                          </button>

                          <span className="font-['IBM_Plex_Mono'] text-xs text-[#D1D5DB] font-semibold">
                            {formatTime(currentTime)} / {formatTime(duration)}
                          </span>
                        </div>

                        {/* Sound, Replay & Fullscreen */}
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <button
                            onClick={() => handleVideoSeek(0)}
                            className="p-1.5 rounded-lg hover:bg-white/15 text-[#9295A0] hover:text-white transition-colors cursor-pointer"
                            title="Replay Video"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>

                          <button
                            onClick={handleToggleModalSound}
                            className="p-1.5 rounded-lg hover:bg-white/15 text-white transition-colors cursor-pointer"
                            title={isMuted ? 'Unmute sound' : 'Mute sound'}
                          >
                            {isMuted ? (
                              <VolumeX className="w-4 h-4 text-[#FF6B6B]" />
                            ) : (
                              <Volume2 className="w-4 h-4 text-[#00FF87]" />
                            )}
                          </button>

                          <button
                            onClick={() => setIsVideoFullscreen(true)}
                            className="p-1.5 rounded-lg hover:bg-white/15 text-white transition-colors cursor-pointer"
                            title="Full Screen View"
                          >
                            <Maximize2 className="w-4 h-4 text-[#FFB800]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full min-h-[440px] sm:min-h-[520px] flex items-center justify-center p-3 sm:p-5 overflow-hidden">
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                      {selectedImage ? (
                        <motion.div
                          key={`stage-slide-${project.id}-${currentGalleryIndex}`}
                          custom={direction}
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          drag="x"
                          dragConstraints={{ left: 0, right: 0 }}
                          dragElastic={0.2}
                          onDragEnd={(_, info) => {
                            if (info.offset.x < -40) {
                              handleNextImage();
                            } else if (info.offset.x > 40) {
                              handlePrevImage();
                            }
                          }}
                          onClick={() => setIsLightboxOpen(true)}
                          className="relative w-full h-full flex items-center justify-center cursor-zoom-in"
                          title="Click to view in 100% full-screen crystal clear resolution (or drag to slide)"
                        >
                          <img
                            src={selectedImage}
                            alt={project.title}
                            referrerPolicy="no-referrer"
                            className={`max-h-[62vh] sm:max-h-[70vh] w-auto max-w-full rounded-2xl shadow-2xl transition-all duration-300 ${
                              fitMode === 'contain'
                                ? 'object-contain'
                                : 'object-cover w-full h-full'
                            }`}
                            style={{
                              imageRendering: 'auto',
                            }}
                          />
                        </motion.div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-8 text-center text-[#9295A0]">
                          <ImageIcon className="w-8 h-8 mb-2" />
                          <span className="font-['IBM_Plex_Mono'] text-xs uppercase">ADD VISUAL</span>
                        </div>
                      )}
                    </AnimatePresence>

                    {/* Top Controls: Zoom & Fit mode */}
                    {selectedImage && (
                      <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
                        <button
                          onClick={() => setFitMode(fitMode === 'contain' ? 'cover' : 'contain')}
                          className="px-2.5 py-1.5 rounded-lg bg-black/80 hover:bg-[#151926] text-white border border-white/15 text-[10px] font-['IBM_Plex_Mono'] uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-lg cursor-pointer"
                          title={fitMode === 'contain' ? 'Switch to Fill View' : 'Switch to Clear Fit View'}
                        >
                          {fitMode === 'contain' ? (
                            <>
                              <Maximize2 className="w-3 h-3 text-[#00FF87]" />
                              <span>Clear Fit</span>
                            </>
                          ) : (
                            <>
                              <Minimize2 className="w-3 h-3 text-[#00FF87]" />
                              <span>Fill</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => setIsLightboxOpen(true)}
                          className="px-2.5 py-1.5 rounded-lg bg-black/80 hover:bg-[#00FF87] text-white hover:text-black border border-white/15 hover:border-[#00FF87] text-[10px] font-['IBM_Plex_Mono'] uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg cursor-pointer"
                          title="Open Ultra High-Res Lightbox"
                        >
                          <ZoomIn className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Ultra HD</span>
                        </button>
                      </div>
                    )}

                    {/* Smooth Navigation Arrows for Sliding */}
                    {galleryImages.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/80 hover:bg-[#00FF87] text-white hover:text-black border border-white/20 hover:border-[#00FF87] flex items-center justify-center transition-all opacity-90 sm:opacity-0 group-hover/stage:opacity-100 shadow-2xl cursor-pointer z-20 hover:scale-105 active:scale-95"
                          aria-label="Previous visual"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/80 hover:bg-[#00FF87] text-white hover:text-black border border-white/20 hover:border-[#00FF87] flex items-center justify-center transition-all opacity-90 sm:opacity-0 group-hover/stage:opacity-100 shadow-2xl cursor-pointer z-20 hover:scale-105 active:scale-95"
                          aria-label="Next visual"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    {/* Dot Pagination Indicators on Stage */}
                    {galleryImages.length > 1 && (
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10">
                        {galleryImages.map((img, i) => (
                          <button
                            key={`stage-dot-${project.id}-${i}`}
                            onClick={() => handleSelectImage(img, i)}
                            className={`transition-all duration-300 rounded-full cursor-pointer ${
                              selectedImage === img
                                ? 'w-6 h-2 bg-[#00FF87]'
                                : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                            }`}
                            title={`Slide to visual 0${i + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Additional Visuals Filmstrip Gallery */}
              {galleryImages.length > 1 && (
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-['IBM_Plex_Mono'] text-xs text-[#9295A0] tracking-wider uppercase flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-[#00FF87]" />
                      <span>CLICK TO SLIDE ({galleryImages.length} VISUALS)</span>
                    </span>
                    <span className="font-['IBM_Plex_Mono'] text-[11px] text-[#636878]">
                      Visual {currentGalleryIndex + 1} of {galleryImages.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-2.5">
                    {galleryImages.map((img, i) => (
                      <button
                        key={`filmstrip-thumb-${project.id}-${i}`}
                        onClick={() => handleSelectImage(img, i)}
                        className={`relative aspect-[4/5] rounded-xl overflow-hidden border-2 transition-all cursor-pointer group ${
                          selectedImage === img
                            ? 'border-[#00FF87] ring-2 ring-[#00FF87]/30 scale-105 shadow-lg shadow-[#00FF87]/20 z-10'
                            : 'border-[#1E2336] opacity-70 hover:opacity-100 hover:border-[#384260]'
                        }`}
                        title={`Slide to Visual 0${i + 1}`}
                      >
                        <img
                          src={img}
                          alt={`${project.title} frame ${i + 1}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <span className="absolute top-1 left-1 font-['IBM_Plex_Mono'] text-[8.5px] font-bold px-1.5 py-0.5 rounded bg-black/85 backdrop-blur-xs text-[#00FF87] border border-white/10">
                          0{i + 1}
                        </span>
                        <span className="absolute bottom-1 right-1 font-['IBM_Plex_Mono'] text-[8px] font-bold px-1 rounded bg-black/80 text-[#FFEAA7]">
                          RG
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Project Details, Scene Breakdown & Little Brief */}
            <div className="lg:col-span-5 space-y-5">
              {/* Category & Badge Header (Playfair Display & Space Grotesk + Champagne Gold) */}
              <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#131008] via-[#0C0E17] to-[#0A0C14] border border-[#FFB800]/25 shadow-xl">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-['IBM_Plex_Mono'] text-xs font-bold px-3 py-1 rounded-md bg-[#FFB800]/15 border border-[#FFB800]/40 text-[#FFB800] tracking-wider uppercase">
                      {project.categoryLabel || categoryInfo?.title || 'PORTFOLIO WORK'}
                    </span>
                    {project.clientOrBrand && (
                      <span className="font-['IBM_Plex_Mono'] text-xs text-[#FFEAA7] font-semibold">
                        {project.clientOrBrand}
                      </span>
                    )}
                  </div>

                  <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#00FF87] font-bold px-2.5 py-0.5 rounded-full bg-[#00FF87]/10 border border-[#00FF87]/30">
                    4K/1080P MASTER
                  </span>
                </div>

                <div>
                  <h1 className="font-['Space_Grotesk'] text-2xl sm:text-3xl lg:text-3xl font-extrabold text-[#F5F3EE] tracking-tight leading-tight">
                    {project.title}
                  </h1>
                  <p className="font-['Playfair_Display'] italic text-sm sm:text-base text-[#FFEAA7]/90 mt-1">
                    {project.id === 'jewellery-ads-01'
                      ? 'Royal Emerald & 22K Gold Bridal Jewellery Ad Direction'
                      : project.id === 'jewellery-ads-02'
                      ? 'Royal Azure Blue Sapphire & Diamond Photoshoot Direction'
                      : project.id === 'jewellery-ads-03'
                      ? 'EMERALD SOVEREIGN — Royal Polki, Emerald & Pearl Photoshoot Direction'
                      : project.id === 'fashion-03'
                      ? 'OVERLAYS — Contemporary Streetwear & Editorial Visual Direction'
                      : project.id === 'fashion-04'
                      ? 'MIDNIGHT BOTANICA — Handcrafted Navy & Silver Saree Editorial Direction'
                      : project.id === 'fashion-05'
                      ? 'CRIMSON MANDALA — Royal Palace Heritage Kurta & Dupatta Editorial Direction'
                      : project.id === 'product-01'
                      ? 'VELVENT REVERIA — Luxury Perfume Commercial Staging & Glass Direction'
                      : project.id === 'product-02'
                      ? 'STRIDE SOLE — Own Designed Footwear Commercial Staging & Visual Direction'
                      : project.id === 'product-ads-01'
                      ? 'STRIDE SOLE — Own Designed Footwear Commercial & Campaign Shoot Direction'
                      : project.id === 'product-ads-02'
                      ? 'LUMINA AMBIENCE — Modern Designer Ambient Lamp Video Ad Direction (Client Work)'
                      : project.id === 'product-ads-03'
                      ? 'OLEVS CHRONO — Luxury Hybrid Wood & Steel Watch Video Ad Direction (Client Work)'
                      : project.id === 'product-ads-04'
                      ? 'VELVENT REVERIA: MOONSTONE — Own Designed Luxury Perfume Video Ad Direction'
                      : project.id === 'ugc-01'
                      ? 'KHATUSHYAM MODELING — AI Fashion Photoshoot & Virtual Studio Software Ad Direction'
                      : project.id === 'ugc-02'
                      ? 'GLAMOLIC AI — AI Fashion Photography & Virtual Studio Software Ad Direction'
                      : project.id === 'campaign-01'
                      ? 'OVERLAYS — 2024 Premium Streetwear Brand Commercial Campaign Direction'
                      : project.id === 'campaign-02'
                      ? 'LIMESTONE — Legacy Day Date Luxury Timepiece Commercial Campaign Direction'
                      : project.id === 'fashion-ads-04'
                      ? 'GILDED GRACE — Royal Temple Ghat Festive Lehenga Video Ad Direction'
                      : project.id === 'fashion-ads-03'
                      ? 'ELYSIAN TIDES — Luxury Resortwear & Coastal Sunset Campaign Direction'
                      : project.id === 'fashion-ads-02'
                      ? 'Designer Embroidered Kurti & Festive Dress Commercial Direction'
                      : project.id === 'fashion-ads-01'
                      ? 'Royal Lotus Silk Saree & Estate Heritage Reel Direction'
                      : project.id === 'video-01'
                      ? 'NARASIMHA — Part 1: Sacred Vedic Storyboard Saga (Connected to Part 2 in Motion)'
                      : project.id === 'video-02'
                      ? 'NARASIMHA — Part 2: Sacred Storyworld in Motion (Motion Sequel to Part 1)'
                      : project.id === 'video-03'
                      ? 'MINECRAFT — Part 1: Live-Action Concept Storyboard (Connected to Part 2 in Motion)'
                      : project.id === 'video-04'
                      ? 'MINECRAFT — Part 2: The Realistic Human World in Motion (Motion Sequel to Part 1)'
                      : 'Editorial Fashion & Motion Campaign Direction'}
                  </p>
                </div>

                {/* Display Mode Tabs Switcher */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#07090F] border border-[#1A2033] pt-1">
                  {[
                    { id: 'all', label: '🌟 All Overview', color: 'text-white' },
                    { id: 'brief', label: '📜 Brief & Vision', color: 'text-[#00FF87]' },
                    { id: 'storyboard', label: '🎬 5-Act Scene Sync', color: 'text-[#FFB800]' },
                    { id: 'specs', label: '⚡ Tech Matrix', color: 'text-[#38BDF8]' },
                  ].map((tab) => (
                    <button
                      key={`tab-btn-${project.id}-${tab.id}`}
                      onClick={() => setDisplayTab(tab.id as any)}
                      className={`flex-1 py-1.5 px-2 rounded-lg font-['IBM_Plex_Mono'] text-[10.5px] uppercase font-bold tracking-wider transition-all cursor-pointer text-center ${
                        displayTab === tab.id
                          ? 'bg-[#181F30] text-white shadow-sm border border-white/20'
                          : 'text-[#7D8296] hover:text-white hover:bg-[#121624]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Connected Storyworld Duology Banner (For Projects 01 & 02, and Projects 03 & 04) */}
              {(project.id === 'video-01' ||
                project.id === 'video-02' ||
                project.id === 'video-03' ||
                project.id === 'video-04') && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#18102A] via-[#101428] to-[#08151D] border border-[#A855F7]/40 shadow-xl space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="p-2 rounded-xl bg-[#A855F7]/20 border border-[#A855F7]/40 text-[#C084FC]">
                        <Link2 className="w-4 h-4" />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-['IBM_Plex_Mono'] text-[11px] font-black tracking-widest text-[#E9D5FF] uppercase">
                            CONNECTED STORYWORLD SAGA
                          </span>
                          <span className="font-['IBM_Plex_Mono'] text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-[#00FF87]/15 text-[#00FF87] border border-[#00FF87]/30">
                            {project.id === 'video-01' || project.id === 'video-03'
                              ? 'PART 1 OF 2 • STORYBOARD'
                              : 'PART 2 OF 2 • IN MOTION'}
                          </span>
                        </div>
                        <h4 className="font-['Space_Grotesk'] text-sm sm:text-base font-bold text-white mt-0.5">
                          {project.id === 'video-01' || project.id === 'video-02'
                            ? 'Vedic Lore Duology: Project 01 (Storyboard) & Project 02 (In Motion)'
                            : 'Minecraft Duology: Project 03 (Concept Storyboard) & Project 04 (Live-Action In Motion)'}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <p className="font-['Manrope'] text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                    {project.id === 'video-01'
                      ? 'This 8-frame sacred visual storyboard serves as the conceptual origin. The narrative continues into thunderous celestial motion physics in Project 02.'
                      : project.id === 'video-02'
                      ? 'This cinematic motion production is the temporal sequel to the 8-frame sacred visual storyboard developed in Project 01.'
                      : project.id === 'video-03'
                      ? 'This 8-frame live-action concept storyboard chronicles "The Great Dimensional Breach". Watch the survival battle and dragon siege realized in full cinematic motion in Project 04.'
                      : 'This live-action gaming motion production is the temporal sequel to the 8-frame concept storyboard in Project 03, continuing the fight against the Ender Dragon.'}
                  </p>

                  {/* Quick Switch Button to Connected Pair */}
                  {connectedProject && (
                    <button
                      onClick={() => onSelectProject(connectedProject)}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#A855F7]/25 hover:from-[#A855F7]/40 to-[#38BDF8]/25 hover:to-[#38BDF8]/40 border border-[#A855F7]/40 hover:border-[#38BDF8]/60 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-['IBM_Plex_Mono'] text-[10.5px] text-[#C084FC] uppercase font-bold tracking-wider shrink-0">
                          Jump to Connected Part:
                        </span>
                        <span className="font-['Space_Grotesk'] text-xs sm:text-sm font-bold text-white truncate group-hover:text-[#F0FDF4] transition-colors">
                          {connectedProject.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 font-['IBM_Plex_Mono'] text-[10.5px] font-bold text-[#38BDF8] group-hover:text-white uppercase tracking-wider shrink-0">
                        <span>Open {connectedProject.badgeLabel}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </button>
                  )}
                </motion.div>
              )}

              {/* Section 1: About Brief & Campaign Narrative (Manrope font + Emerald/Mint Theme) */}
              {(displayTab === 'all' || displayTab === 'brief') && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 sm:p-5 rounded-2xl bg-[#091512] border border-[#00FF87]/30 shadow-lg space-y-3 transition-all hover:border-[#00FF87]/60"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-['IBM_Plex_Mono'] text-xs text-[#00FF87] uppercase tracking-widest font-bold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#00FF87]" />
                      <span>CAMPAIGN BRIEF & PRODUCTION NARRATIVE</span>
                    </span>
                    <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#A7F3D0] px-2 py-0.5 rounded bg-[#00FF87]/15">
                      DIRECTOR'S CUT
                    </span>
                  </div>

                  <p className="font-['Manrope'] text-sm sm:text-base text-[#F0FDF4] leading-relaxed font-normal">
                    {project.shortDescription}
                  </p>

                  {project.fullDescription && (
                    <div className="pt-2 border-t border-[#00FF87]/20">
                      <p className="font-['Manrope'] text-xs sm:text-sm text-[#D1FAE5] leading-relaxed">
                        {briefExpanded ? project.fullDescription : `${project.fullDescription.slice(0, 160)}...`}
                      </p>
                      <button
                        onClick={() => setBriefExpanded(!briefExpanded)}
                        className="font-['IBM_Plex_Mono'] text-xs text-[#00FF87] hover:underline font-bold mt-1.5 flex items-center gap-1 cursor-pointer"
                      >
                        <span>{briefExpanded ? 'Collapse Brief Details' : 'Read Full Production Brief'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Highlights Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(project.id === 'jewellery-ads-01'
                      ? ['Royal Emerald Suite', 'Emerald Green Drops', '22K Antique Gold Choker', 'Polki Diamonds', 'Bridal Maang Tikka', 'Temple Jhumkas', '1080p Video Reel']
                      : project.id === 'jewellery-ads-02'
                      ? ['Royal Azure Suite', 'Blue Sapphire', 'Diamond Halo Choker', 'Chandelier Earrings', 'Bridal Maang Tikka', 'Raw Stone Slabs', '2K Macro Photoshoot']
                      : project.id === 'jewellery-ads-03'
                      ? ['Emerald Sovereign', 'Polki Diamond Bib Choker', 'Emerald Heart Clusters', 'Basra Pearl Drops', 'Chandelier Drop Earrings', 'Emerald Velvet Gown', '9-Part Campaign Photoshoot']
                      : project.id === 'fashion-03'
                      ? ['OVERLAYS', 'Contemporary Streetwear', 'Oversized Drape', 'Minimalist Layering', 'Heavyweight Cotton', '4-Part Lookbook', 'Editorial Master']
                      : project.id === 'fashion-04'
                      ? ['MIDNIGHT BOTANICA', 'Navy & Silver Saree', 'Botanical Leaf Motifs', 'Semi-Sheer Organza', 'Oxidized Silver Jhumkas', 'Lakeside Editorial', '3-Part Visual Series']
                      : project.id === 'fashion-05'
                      ? ['CRIMSON MANDALA', 'Royal Palace Heritage', 'Gold Mandala Print', 'Mirror-Work Yoke', 'Chanderi Silk', 'Indo-Saracenic Arches', '5-Part Visual Series']
                      : project.id === 'product-01'
                      ? ['VELVENT REVERIA', 'Crystal Glass', 'Luxury Fragrance', 'Optical Caustics', 'Fluted Texture', 'Studio Reflections', 'Bespoke Design']
                      : project.id === 'product-02'
                      ? ['STRIDE SOLE', 'Own Designed Footwear', 'Product Visuals 7-Part Series', 'Kinetic Cushioning', 'Engineered Knit Mesh', 'Multi-Angle Studio', 'Commercial Lookbook']
                      : project.id === 'product-ads-01'
                      ? ['STRIDE SOLE', 'Own Designed Shoe', 'Shoe Campaign Shoot', 'Kinetic Cushioning', 'Engineered Knit Mesh', 'Exploded Outsole', 'High-Conversion Ad']
                      : project.id === 'product-ads-02'
                      ? ['LUMINA AMBIENCE', 'Client Work', 'Designer Table Lamp', 'Crimson Fluted Dome', 'Brass Dimmer Rotary', '2700K Warm Glow', 'Luxury Interior Ad']
                      : project.id === 'product-ads-03'
                      ? ['OLEVS CHRONO', 'Client Work', 'Luxury Hybrid Watch', 'Walnut Wood Bezel', 'Moonphase Complication', 'Executive Suiting', 'Timepiece Video Ad']
                      : project.id === 'product-ads-04'
                      ? ['VELVENT REVERIA', 'Own Design Perfume Ad', 'Cobalt Crystal Flacon', 'Crashing Ocean Rock', 'Fluted Gold Cap', 'Midnight Supercar', 'Cinematic Fragrance Ad']
                      : project.id === 'ugc-01'
                      ? ['Khatushyam Modeling', 'Client Software Ad', 'AI Fashion Photoshoot', 'Virtual Studio', '1-Click Catalog', 'Cost Saving', 'Viral Reel Ad']
                      : project.id === 'ugc-02'
                      ? ['Glamolic AI', 'Client Software Ad', 'AI Fashion Studio', 'glamolic.com', 'Zero Studio Overhead', 'Fast Lookbooks', 'Performance UGC']
                      : project.id === 'campaign-01'
                      ? ['OVERLAYS', 'Premium Apparel', 'Since 2024', 'Sunset Orange Tee', 'Heavyweight Cotton', 'Brutalist Staging', 'AI Creation Outro', 'Brand Campaign']
                      : project.id === 'campaign-02'
                      ? ['LIMESTONE', 'Legacy Day Date', 'Luxury Timepiece', 'Ruby Sunray Dial', 'Fluted Gold Bezel', 'Presidential Bracelet', 'Executive Suiting', 'Genuine Certification']
                      : project.id === 'fashion-ads-03'
                      ? ['ELYSIAN TIDES', 'Luxury Resortwear', 'Linen Co-ord Set', 'Camp-Collar Shirt', 'Tropical Sunset Print', 'Surfboard Aesthetic', 'High-Conversion Reel']
                      : project.id === 'fashion-ads-04'
                      ? ['GILDED GRACE', 'Varanasi Ghat Heritage', 'Crimson Banarasi Lehenga', 'Gold Zari Brocade', 'Saffron Yellow Dupatta', 'Bansuri Flute', 'Festive Video Reel']
                      : project.id === 'fashion-ads-02'
                      ? ['Designer Kurti Flare', 'Embroidered Yoke', 'Resham Threadwork', 'Anarkali Twirl Physics', 'Dupatta Drape', 'Festive Conversion']
                      : project.id === 'fashion-ads-01'
                      ? ['Lotus Pond Saree', '22K Gold Zari Border', 'Palace Heritage', 'Tree of Life Pallu', 'Commercial Master']
                      : project.id === 'video-01'
                      ? ['Sacred Vedic Lore', '8-Part Visual Saga', 'Lord Narasimha', 'Bhakta Prahlad', 'Hiranyakashipu', 'Sacred Chiaroscuro', 'Sanatana Dharma', 'Connected to Project 02']
                      : project.id === 'video-02'
                      ? ['Vedic Storyworld in Motion', 'Project 01 Motion Sequel', 'Cosmic Lightning', 'Lord Narasimha Roar', 'Twilight Threshold Boons', 'Temporal VFX', 'Connected to Project 01']
                      : project.id === 'video-03'
                      ? ['Minecraft Live-Action', '8-Part Concept Storyboard', 'Human Steve & Alex', 'Dimensional Breach', 'Nether Portal Ignition', 'Ender Dragon Siege', 'Iron Golems', 'Connected to Project 04']
                      : project.id === 'video-04'
                      ? ['Minecraft in Motion', 'Live-Action Gaming Cinematic', 'Project 03 Motion Sequel', 'Ender Dragon Plasma Breath', 'Crystal Enchanted Armor', 'Iron Golem Guardians', 'Connected to Project 03']
                      : ['Haute Couture Drapery', 'Fluid Silk Physics', 'Editorial Rim Strobe', 'Commercial Conversion']
                    ).map((tag, i) => (
                      <span
                        key={`tag-pill-${project.id}-${i}-${tag}`}
                        className="font-['IBM_Plex_Mono'] text-[9.5px] px-2.5 py-1 rounded-full bg-[#00FF87]/10 text-[#6EE7B7] border border-[#00FF87]/25 font-semibold"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Section 2: Creative Direction & Manifesto (Playfair Display + Electric Violet Theme) */}
              {(displayTab === 'all' || displayTab === 'brief') && project.creativeDirection && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 sm:p-5 rounded-2xl bg-[#140C22] border border-[#A855F7]/35 shadow-lg space-y-2.5 transition-all hover:border-[#A855F7]/70"
                >
                  <div className="flex items-center justify-between text-[#C084FC]">
                    <div className="flex items-center gap-2 font-['IBM_Plex_Mono'] text-xs uppercase tracking-wider font-bold">
                      <Compass className="w-4 h-4 text-[#C084FC]" />
                      <span>
                        {project.id === 'jewellery-ads-01'
                          ? 'ROYAL EMERALD JEWELLERY AD CAMPAIGN DIRECTION'
                          : project.id === 'jewellery-ads-02'
                          ? 'ROYAL AZURE BLUE JEWELLERY PHOTOSHOOT DIRECTION'
                          : project.id === 'jewellery-ads-03'
                          ? 'EMERALD SOVEREIGN HIGH-JEWELLERY PHOTOSHOOT DIRECTION'
                          : project.id === 'fashion-03'
                          ? 'OVERLAYS CONTEMPORARY STREETWEAR DIRECTION'
                          : project.id === 'fashion-04'
                          ? 'MIDNIGHT BOTANICA NAVY & SILVER SAREE EDITORIAL DIRECTION'
                          : project.id === 'fashion-05'
                          ? 'CRIMSON MANDALA ROYAL PALACE HERITAGE DIRECTION'
                          : project.id === 'product-01'
                          ? 'VELVENT REVERIA LUXURY PERFUME DIRECTION'
                          : project.id === 'product-02'
                          ? 'STRIDE SOLE FOOTWEAR VISUAL DIRECTION'
                          : project.id === 'product-ads-01'
                          ? 'STRIDE SOLE SHOE CAMPAIGN SHOOT DIRECTION'
                          : project.id === 'product-ads-02'
                          ? 'LUMINA AMBIENCE DESIGNER LAMP COMMERCIAL DIRECTION'
                          : project.id === 'product-ads-03'
                          ? 'OLEVS CHRONO LUXURY WATCH COMMERCIAL DIRECTION'
                          : project.id === 'product-ads-04'
                          ? 'VELVENT REVERIA MOONSTONE PERFUME AD DIRECTION'
                          : project.id === 'ugc-01'
                          ? 'KHATUSHYAM MODELING AI FASHION SOFTWARE AD DIRECTION'
                          : project.id === 'ugc-02'
                          ? 'GLAMOLIC AI VIRTUAL STUDIO SOFTWARE AD DIRECTION'
                          : project.id === 'campaign-01'
                          ? 'OVERLAYS 2024 PREMIUM STREETWEAR CAMPAIGN DIRECTION'
                          : project.id === 'campaign-02'
                          ? 'LIMESTONE LEGACY DAY DATE LUXURY TIMEPIECE CAMPAIGN DIRECTION'
                          : project.id === 'fashion-ads-03'
                          ? 'ELYSIAN TIDES LUXURY RESORTWEAR DIRECTION'
                          : project.id === 'fashion-ads-04'
                          ? 'GILDED GRACE ROYAL TEMPLE GHAT FESTIVE LEHENGA DIRECTION'
                          : project.id === 'fashion-ads-02'
                          ? 'ETHNIC COUTURE CREATIVE DIRECTION'
                          : project.id === 'video-01'
                          ? 'NARASIMHA SACRED VEDIC STORYBOARD DIRECTION'
                          : project.id === 'video-02'
                          ? 'NARASIMHA SACRED STORYWORLD IN MOTION DIRECTION'
                          : project.id === 'video-03'
                          ? 'MINECRAFT LIVE-ACTION CONCEPT STORYBOARD DIRECTION'
                          : project.id === 'video-04'
                          ? 'MINECRAFT REALISTIC HUMAN WORLD IN MOTION DIRECTION'
                          : 'HAUTE COUTURE CREATIVE DIRECTION'}
                      </span>
                    </div>
                    <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#E9D5FF] px-2 py-0.5 rounded bg-[#A855F7]/20">
                      MANIFESTO
                    </span>
                  </div>

                  <p className="font-['Playfair_Display'] italic text-sm sm:text-base text-[#F5F3FF] leading-relaxed tracking-wide">
                    &ldquo;{project.creativeDirection}&rdquo;
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-[#A855F7]/20 text-[11px] font-['IBM_Plex_Mono'] text-[#D8B4FE]">
                    <span>Direction: Rudransh Goyal</span>
                    <span>Style: {project.id === 'jewellery-ads-01' ? 'Royal Emerald & 22K Gold Bridal Video Reel' : project.id === 'jewellery-ads-02' ? 'Royal Azure Blue Sapphire Editorial Photoshoot' : project.id === 'jewellery-ads-03' ? 'Royal Polki, Emerald & Basra Pearl Photoshoot' : project.id === 'fashion-03' ? 'OVERLAYS Contemporary Urban Streetwear' : project.id === 'campaign-01' ? 'OVERLAYS 2024 Heavyweight Streetwear Ad' : project.id === 'campaign-02' ? 'Limestone Legacy Day Date Horology Ad' : project.id === 'fashion-04' ? 'Artisanal Navy & Silver Saree Editorial' : project.id === 'fashion-05' ? 'Royal Palace Crimson & Gold Mandala Ensemble' : project.id === 'product-01' ? 'Luxury Fragrance & Sculpted Glass Staging' : project.id === 'product-02' ? 'STRIDE SOLE Visual Series (Own Design)' : project.id === 'product-ads-01' ? 'STRIDE SOLE Campaign Shoot (Own Design)' : project.id === 'product-ads-02' ? 'Modern Designer Ambient Table Lamp Ad (Client Work)' : project.id === 'product-ads-03' ? 'OLEVS Hybrid Wood & Steel Chronograph Ad (Client Work)' : project.id === 'product-ads-04' ? 'VELVENT REVERIA: Moonstone Fragrance Ad (Own Design)' : project.id === 'ugc-01' ? 'Khatushyam Modeling AI Software Performance UGC Ad' : project.id === 'ugc-02' ? 'Glamolic AI Virtual Studio Direct-Response Software Ad' : project.id === 'fashion-ads-04' ? 'Royal Temple Ghat Festive Banarasi Lehenga' : project.id === 'fashion-ads-03' ? 'Luxury Resortwear & Tropical Linen Co-ord' : project.id === 'fashion-ads-02' ? 'Festive Designer Ethnic' : project.id === 'video-01' ? 'Sacred Vedic Epic & Classical Chiaroscuro Storyboard' : project.id === 'video-02' ? 'Cyber-Mythic & Sacred Celestial Motion VFX' : project.id === 'video-03' ? 'Live-Action Gaming Adaptation & Cinematic Concept Storyboard' : project.id === 'video-04' ? 'Hyper-Realistic Live-Action Gaming Cinematic in Motion' : 'High-Fashion Luxury'}</span>
                  </div>
                </motion.div>
              )}

              {/* Section 3: Interactive 5-Act Scene Breakdown (Space Grotesk + IBM Plex Mono + Sunset Amber Theme) */}
              {(displayTab === 'all' || displayTab === 'storyboard') && projectScenes && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 sm:p-5 rounded-2xl bg-[#161208] border border-[#F59E0B]/35 shadow-lg space-y-3 transition-all hover:border-[#F59E0B]/60"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-['IBM_Plex_Mono'] text-xs text-[#F59E0B] uppercase tracking-widest font-bold flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-[#F59E0B]" />
                      <span>{projectScenes.length}-ACT SCENE BREAKDOWN {hasVideo ? '(CLICK TO JUMP)' : '(CLICK TO VIEW)'}</span>
                    </span>
                    <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#FDE68A] px-2 py-0.5 rounded bg-[#F59E0B]/20 font-bold">
                      LIVE SYNC
                    </span>
                  </div>

                  <div className="space-y-2">
                    {projectScenes.map((sc, idx) => {
                      const isActive =
                        mediaViewMode === 'gallery'
                          ? currentGalleryIndex === idx
                          : currentTime >= (sc.time || 0) &&
                            currentTime < (projectScenes[idx + 1]?.time || duration + 1);

                      return (
                        <button
                          key={`scene-row-${project.id}-${sc.time ?? idx}-${idx}`}
                          onClick={() => {
                            if (mediaViewMode === 'video' && sc.time !== undefined) {
                              handleVideoSeek(sc.time);
                            } else if (galleryImages[idx]) {
                              handleSelectImage(galleryImages[idx], idx);
                              setMediaViewMode('gallery');
                            }
                          }}
                          className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 relative overflow-hidden ${
                            isActive
                              ? 'bg-[#241B0A] border-[#FFB800] shadow-md shadow-[#FFB800]/20 ring-1 ring-[#FFB800]/50'
                              : 'bg-[#0E0C06] border-[#2A2210] hover:border-[#4D3E1C]'
                          }`}
                        >
                          {/* Active Indicator Bar on Left */}
                          {isActive && (
                            <div className="absolute left-0 inset-y-0 w-1 bg-[#FFB800] animate-pulse" />
                          )}

                          <span
                            className={`font-['IBM_Plex_Mono'] text-[10px] font-extrabold px-2 py-1 rounded mt-0.5 ${
                              isActive
                                ? 'bg-[#FFB800] text-black shadow-sm'
                                : 'bg-[#1C170B] text-[#D97706]'
                            }`}
                          >
                            {sc.act}
                          </span>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <h5 className="font-['Space_Grotesk'] text-xs sm:text-sm font-bold text-[#FFFBEB] truncate">
                                {sc.title}
                              </h5>
                              {sc.time !== undefined && (
                                <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#FFB800] font-bold">
                                  {formatTime(sc.time)}
                                </span>
                              )}
                            </div>
                            <p className="font-['Manrope'] text-xs text-[#D1D5DB] line-clamp-2 mt-0.5 leading-relaxed">
                              {sc.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Section 4: Technical Specifications & Telemetry Matrix (IBM Plex Mono + Cyber Cyan Theme) */}
              {(displayTab === 'all' || displayTab === 'specs') && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 sm:p-5 rounded-2xl bg-[#08131E] border border-[#0EA5E9]/35 shadow-lg space-y-3 transition-all hover:border-[#0EA5E9]/60"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-['IBM_Plex_Mono'] text-xs text-[#38BDF8] uppercase tracking-widest font-bold flex items-center gap-1.5">
                      <Gauge className="w-4 h-4 text-[#38BDF8]" />
                      <span>TECHNICAL SPECIFICATIONS & TELEMETRY</span>
                    </span>
                    <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#BAE6FD] px-2 py-0.5 rounded bg-[#0284C7]/25 font-bold">
                      VERIFIED 1080P
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-['IBM_Plex_Mono'] text-xs">
                    <div className="p-2.5 rounded-xl bg-[#061B2B] border border-[#0284C7]/20">
                      <span className="text-[9.5px] text-[#7DD3FC] uppercase block font-semibold">Resolution</span>
                      <span className="font-bold text-[#F0F9FF] text-xs">1080 × 1920 (9:16)</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#061B2B] border border-[#0284C7]/20">
                      <span className="text-[9.5px] text-[#7DD3FC] uppercase block font-semibold">Framerate</span>
                      <span className="font-bold text-[#F0F9FF] text-xs">60 FPS Cinematic</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#061B2B] border border-[#0284C7]/20">
                      <span className="text-[9.5px] text-[#7DD3FC] uppercase block font-semibold">Color Grade</span>
                      <span className="font-bold text-[#F0F9FF] text-xs">DCI-P3 Runway</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#061B2B] border border-[#0284C7]/20">
                      <span className="text-[9.5px] text-[#7DD3FC] uppercase block font-semibold">Sound Design</span>
                      <span className="font-bold text-[#F0F9FF] text-xs">Hi-Fi Audio Master</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#061B2B] border border-[#0284C7]/20">
                      <span className="text-[9.5px] text-[#7DD3FC] uppercase block font-semibold">
                        {project.id === 'jewellery-ads-01' || project.id === 'jewellery-ads-02' || project.id === 'jewellery-ads-03'
                          ? 'Ornament Physics'
                          : project.id === 'campaign-01'
                          ? 'Streetwear Textile'
                          : project.id === 'campaign-02'
                          ? 'Horological Craft'
                          : project.id.startsWith('product-')
                          ? 'Material Physics'
                          : project.id.startsWith('ugc-')
                          ? 'Software Platform'
                          : 'Textile Physics'}
                      </span>
                      <span className="font-bold text-[#F0F9FF] text-xs">
                        {project.id === 'jewellery-ads-01'
                          ? '22K Gold, Emeralds & Polki'
                          : project.id === 'jewellery-ads-02'
                          ? 'Blue Sapphire & Pavé Diamonds'
                          : project.id === 'jewellery-ads-03'
                          ? 'Polki Diamonds, Emeralds & Basra Pearls'
                          : project.id === 'product-01'
                          ? 'Sculpted Crystal Glass & Amber Fragrance'
                          : project.id === 'product-02' || project.id === 'product-ads-01'
                          ? 'Kinetic Foam & Knit Mesh'
                          : project.id === 'product-ads-02'
                          ? 'Fluted Glass, Brass & Ceramic'
                          : project.id === 'product-ads-03'
                          ? 'Walnut Wood & Black Stainless Steel'
                          : project.id === 'product-ads-04'
                          ? 'Cobalt Crystal & Liquid Fragrance'
                          : project.id === 'ugc-01'
                          ? 'Khatushyam Modeling AI Studio Engine'
                          : project.id === 'ugc-02'
                          ? 'Glamolic AI Virtual Runway Engine (glamolic.com)'
                          : project.id === 'campaign-01'
                          ? 'Heavyweight 280 GSM Cotton & Drop Shoulder'
                          : project.id === 'campaign-02'
                          ? 'Fluted 18K Gold Plated Steel & Ruby Sunburst Dial'
                          : project.id === 'fashion-03'
                          ? 'Heavyweight Cotton & Structured Drape'
                          : project.id === 'fashion-04'
                          ? 'Semi-Sheer Organza & Silver Zari'
                          : project.id === 'fashion-05'
                          ? 'Chanderi Silk & Gold Foil Mandala'
                          : project.id === 'fashion-ads-03'
                          ? 'Breezy Linen & Tropical Vista Print'
                          : project.id === 'fashion-ads-04'
                          ? 'Crimson Silk Brocade & Saffron Dupatta'
                          : project.id === 'fashion-ads-02'
                          ? 'Georgette & Chanderi'
                          : project.id === 'fashion-ads-01'
                          ? 'Raw Silk & 22K Zari'
                          : 'Dynamic Silk Weave'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#061B2B] border border-[#0284C7]/20">
                      <span className="text-[9.5px] text-[#7DD3FC] uppercase block font-semibold">AI Direction</span>
                      <span className="font-bold text-[#F0F9FF] text-xs">@rgcreation711</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Section 5: Direct Action & Collaboration Bar */}
              <div className="p-4 rounded-2xl bg-[#0B0E17] border border-[#1E2538] flex items-center justify-between flex-wrap gap-2.5">
                <div className="flex items-center gap-2">
                  <a
                    href="https://wa.me/919999999999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#00FF87] hover:bg-[#26FF96] text-black font-['Space_Grotesk'] text-xs font-bold transition-all shadow-lg cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Inquire for Campaign</span>
                  </a>

                  <button
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(window.location.href);
                        setCopiedLink(true);
                        triggerFeedback('Link Copied!');
                        setTimeout(() => setCopiedLink(false), 2000);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#141926] hover:bg-[#1E2538] text-[#D1D5DB] hover:text-white font-['IBM_Plex_Mono'] text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#FFB800]" />
                    <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>

                {project.externalUrl && (
                  <a
                    href={project.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-['IBM_Plex_Mono'] text-[#00FF87] hover:underline"
                  >
                    <span>Source</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Mobile next/prev controls */}
              <div className="sm:hidden pt-4 border-t border-[#1A1E2C] flex items-center justify-between">
                <button
                  onClick={() => prevProject && onSelectProject(prevProject)}
                  className="flex items-center gap-1 text-xs font-['IBM_Plex_Mono'] text-[#9295A0]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>PREVIOUS</span>
                </button>
                <button
                  onClick={() => nextProject && onSelectProject(nextProject)}
                  className="flex items-center gap-1 text-xs font-['IBM_Plex_Mono'] text-[#00FF87]"
                >
                  <span>NEXT</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Dedicated Ultra High-Resolution Lightbox Modal */}
        <AnimatePresence>
          {isLightboxOpen && selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLightboxOpen(false)}
              className="fixed inset-0 z-60 bg-black/98 backdrop-blur-3xl flex flex-col items-center justify-between p-4 sm:p-8 cursor-zoom-out"
            >
              {/* Lightbox Top bar */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-6xl flex items-center justify-between z-30"
              >
                <div className="flex items-center gap-3">
                  <span className="font-['IBM_Plex_Mono'] text-xs font-semibold px-3 py-1 rounded-full bg-[#121520] border border-[#23283B] text-[#00FF87]">
                    FULL HIGH-RESOLUTION VIEW
                  </span>
                  <span className="font-['IBM_Plex_Mono'] text-xs text-[#9295A0]">
                    Visual {currentGalleryIndex + 1} of {galleryImages.length}
                  </span>
                </div>

                <button
                  onClick={() => setIsLightboxOpen(false)}
                  className="p-2.5 rounded-full bg-[#121520] hover:bg-[#1E2336] text-[#9295A0] hover:text-white border border-[#23283B] transition-colors cursor-pointer"
                  aria-label="Close Lightbox"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Lightbox Main Image with slide animation */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-7xl max-h-[82vh] w-full flex items-center justify-center my-auto cursor-default overflow-hidden"
              >
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={`lightbox-slide-${project.id}-${currentGalleryIndex}`}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="flex items-center justify-center w-full h-full"
                  >
                    <img
                      src={selectedImage}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="max-h-[80vh] w-auto max-w-full object-contain rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.9)]"
                      style={{
                        imageRendering: 'auto',
                      }}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Lightbox navigation arrows */}
                {galleryImages.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 sm:-left-12 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/80 hover:bg-[#00FF87] text-white hover:text-black border border-white/20 hover:border-[#00FF87] flex items-center justify-center transition-all shadow-2xl cursor-pointer"
                      aria-label="Previous Image"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 sm:-right-12 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/80 hover:bg-[#00FF87] text-white hover:text-black border border-white/20 hover:border-[#00FF87] flex items-center justify-center transition-all shadow-2xl cursor-pointer"
                      aria-label="Next Image"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Lightbox Bottom Thumbnail strip */}
              {galleryImages.length > 1 && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-2xl flex items-center justify-center gap-2 overflow-x-auto py-2 z-30"
                >
                  {galleryImages.map((img, i) => (
                    <button
                      key={`lightbox-thumb-${project.id}-${i}`}
                      onClick={() => handleSelectImage(img, i)}
                      className={`relative w-12 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedImage === img
                          ? 'border-[#00FF87] ring-2 ring-[#00FF87]/40 scale-105'
                          : 'border-white/20 opacity-50 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`thumb ${i + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dedicated Full Screen Portrait Video Modal */}
        <AnimatePresence>
          {isVideoFullscreen && hasVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-70 bg-black/98 backdrop-blur-3xl flex flex-col items-center justify-between p-3 sm:p-6 select-none"
            >
              {/* Fullscreen Top Navigation Bar */}
              <div className="w-full max-w-5xl flex items-center justify-between z-30">
                <div className="flex items-center gap-3">
                  <span className="font-['IBM_Plex_Mono'] text-xs font-semibold px-3 py-1 rounded-full bg-[#121520] border border-[#23283B] text-[#FFB800] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FFB800] animate-pulse" />
                    <span>FULL SCREEN CINEMATIC</span>
                  </span>
                  <span className="hidden sm:inline font-['Space_Grotesk'] text-sm font-bold text-white truncate max-w-xs">
                    {project.title}
                  </span>
                </div>

                {/* Top Corner Sound & Close Controls */}
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleToggleModalSound}
                    className="px-3 py-1.5 rounded-full bg-[#121520] hover:bg-[#1E2336] text-white border border-white/20 text-xs font-['IBM_Plex_Mono'] uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg cursor-pointer hover:scale-105"
                    title={isMuted ? 'Turn Sound On' : 'Turn Sound Off'}
                  >
                    {isMuted ? (
                      <>
                        <VolumeX className="w-4 h-4 text-[#FF6B6B]" />
                        <span>Sound OFF</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-[#00FF87]" />
                        <span>Sound ON</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setIsVideoFullscreen(false)}
                    className="p-2.5 rounded-full bg-[#121520] hover:bg-[#1E2336] text-[#9295A0] hover:text-white border border-[#23283B] transition-colors cursor-pointer"
                    aria-label="Exit Full Screen"
                    title="Exit Full Screen (Esc)"
                  >
                    <Minimize2 className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Fullscreen Video Centered Stage — Strictly Portrait Aspect Preserved Without Distortion */}
              <div className="relative my-auto flex items-center justify-center max-w-full max-h-[82vh] overflow-hidden group/fs">
                <video
                  src={videoSource}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  onClick={handleTogglePlayPause}
                  onTimeUpdate={(e) => {
                    const target = e.currentTarget;
                    setCurrentTime(target.currentTime);
                    if (target.duration && !isNaN(target.duration)) {
                      setDuration(target.duration);
                    }
                  }}
                  className="max-h-[82vh] aspect-[9/16] w-auto max-w-[94vw] object-contain rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.9)] border border-white/10 cursor-pointer"
                />

                {/* Big Center Play/Pause Indicator in Distinct Color */}
                <div
                  onClick={handleTogglePlayPause}
                  className={`absolute inset-0 flex items-center justify-center pointer-events-auto cursor-pointer transition-all duration-300 ${
                    !isPlaying
                      ? 'opacity-100 bg-black/45 backdrop-blur-xs'
                      : 'opacity-0 hover:opacity-100 hover:bg-black/20'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <button
                      className="w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-[#FFB800] hover:bg-[#FFC933] text-black border-2 border-black/20 flex items-center justify-center shadow-[0_0_40px_rgba(255,184,0,0.7)] hover:scale-110 active:scale-95 transition-all cursor-pointer"
                      title={isPlaying ? 'Pause Video (Space)' : 'Play Video (Space)'}
                    >
                      {isPlaying ? (
                        <Pause className="w-9 h-9 fill-current text-black" />
                      ) : (
                        <Play className="w-9 h-9 fill-current text-black ml-1" />
                      )}
                    </button>
                    {!isPlaying && (
                      <span className="font-['IBM_Plex_Mono'] text-xs uppercase font-bold tracking-widest text-[#FFB800] bg-black/85 px-3.5 py-1 rounded-full border border-[#FFB800]/40 shadow-lg">
                        PAUSED
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Fullscreen Floating Bottom Controls Bar */}
              <div className="w-full max-w-xl z-30 p-3.5 rounded-2xl bg-black/85 backdrop-blur-xl border border-white/15 text-white shadow-2xl space-y-2">
                {/* Scrubber Progress Bar */}
                <div
                  className="relative w-full h-2 rounded-full bg-white/20 overflow-hidden cursor-pointer group/scrub"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pos = (e.clientX - rect.left) / rect.width;
                    handleVideoSeek(pos * duration);
                  }}
                >
                  <div
                    className="h-full bg-gradient-to-r from-[#FFB800] to-[#00FF87] rounded-full transition-all duration-100"
                    style={{
                      width: `${(currentTime / Math.max(1, duration)) * 100}%`,
                    }}
                  />
                </div>

                {/* Buttons Row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={handleTogglePlayPause}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FFB800] hover:bg-[#FFC933] text-black font-['IBM_Plex_Mono'] text-xs font-bold uppercase tracking-wider transition-transform active:scale-95 cursor-pointer shadow-md shadow-[#FFB800]/25"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Play</span>
                        </>
                      )}
                    </button>

                    <span className="font-['IBM_Plex_Mono'] text-xs text-[#D1D5DB] font-semibold">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVideoSeek(0)}
                      className="p-1.5 rounded-lg hover:bg-white/15 text-[#9295A0] hover:text-white transition-colors cursor-pointer"
                      title="Replay Video"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={handleToggleModalSound}
                      className="p-1.5 rounded-lg hover:bg-white/15 text-white transition-colors cursor-pointer"
                      title={isMuted ? 'Unmute sound' : 'Mute sound'}
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4 text-[#FF6B6B]" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-[#00FF87]" />
                      )}
                    </button>

                    <button
                      onClick={() => setIsVideoFullscreen(false)}
                      className="p-1.5 rounded-lg hover:bg-white/15 text-white transition-colors cursor-pointer"
                      title="Exit Full Screen"
                    >
                      <Minimize2 className="w-4 h-4 text-[#FFB800]" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
};

