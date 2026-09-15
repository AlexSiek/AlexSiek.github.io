const RESULTS = {

  /* Settings shown in the "how it was run" box. Edit to match the final code. */
  config: {
    metric: "NCC on mean-subtracted, normalised channels (SSD also implemented)",
    searchWindow: "[-15, 15] px in both axes, exhaustive",
    borderCrop: "inner 80% of the frame scored, 10% dropped from every edge",
    pyramidLevels: "recursive halving until the short side is under 400 px, so 5 levels on the .tif scans",
    coarseWindow: "[-15, 15] px at the coarsest level, then [-2, 2] refinement per level on the way down",
  },

  /* Part 1: exhaustive single scale search, low resolution JPEGs. */
  singleScale: [
    { name: "cathedral", file: "single_cathedral.jpg", g: [2, 5],  r: [3, 12], seconds: 4.1,
      notes: "Matches the offsets published with the handout." },
    { name: "monastery", file: "single_monastery.jpg", g: [2, -3], r: [2, 3],  seconds: 3.9,
      notes: "Green moves up, the only negative offset in the set." },
    { name: "tobolsk",   file: "single_tobolsk.jpg",   g: [3, 3],  r: [3, 6],  seconds: 3.8,
      notes: "" },
  ],

  /* Part 2: pyramid alignment on the provided set. */
  pyramid: [
    { name: "cathedral",         file: "pyr_cathedral.jpg",         g: [2, 5],   r: [3, 12],     seconds: 3.6,
      notes: "Same answer as the single scale search." },
    { name: "monastery",         file: "pyr_monastery.jpg",         g: [2, -3],  r: [2, 3],      seconds: 3.7,
      notes: "Same answer as the single scale search." },
    { name: "tobolsk",           file: "pyr_tobolsk.jpg",           g: [3, 3],   r: [3, 6],      seconds: 4.0,
      notes: "Same answer as the single scale search." },
    { name: "church",            file: "pyr_church.jpg",            g: [4, 25],  r: [-4, 58],    seconds: 14.2,
      notes: "" },
    { name: "emir",              file: "pyr_emir.jpg",              g: [24, 49], r: [-205, 141], seconds: 13.3,
      notes: "Fails. The red offset is roughly 200 px out, see the failures section." },
    { name: "harvesters",        file: "pyr_harvesters.jpg",        g: [17, 60], r: [13, 124],   seconds: 11.8,
      notes: "" },
    { name: "icon",              file: "pyr_icon.jpg",              g: [17, 41], r: [23, 89],    seconds: 12.1,
      notes: "" },
    { name: "ilemselga",         file: "pyr_ilemselga.jpg",         g: [7, 40],  r: [11, 130],   seconds: 12.1,
      notes: "" },
    { name: "melons",            file: "pyr_melons.jpg",            g: [11, 82], r: [13, 178],   seconds: 12.1,
      notes: "Largest red displacement in the set." },
    { name: "religous_painting", file: "pyr_religous_painting.jpg", g: [3, 28],  r: [7, 68],     seconds: 14.7,
      notes: "Spelling of the filename is the collection's, not mine." },
    { name: "self_portrait",     file: "pyr_self_portrait.jpg",     g: [29, 79], r: [37, 176],   seconds: 12.2,
      notes: "" },
    { name: "siren",             file: "pyr_siren.jpg",             g: [-6, 49], r: [-25, 96],   seconds: 15.0,
      notes: "" },
    { name: "three_generations", file: "pyr_three_generations.jpg", g: [14, 53], r: [11, 112],   seconds: 11.7,
      notes: "" },
    { name: "wharf",             file: "pyr_wharf.jpg",             g: [-7, 15], r: [-16, 83],   seconds: 14.8,
      notes: "" },
  ],

  /* Part 3: red aligned to green instead of to blue, then the two offsets added.
     All 17 plates, the provided 14 plus my own 3 from the Library of Congress. */
  chained: [
    { name: "cathedral",         file: "chain_cathedral.jpg",         g: [2, 5],    r: [3, 12], seconds: 4.8,    notes: "" },
    { name: "monastery",         file: "chain_monastery.jpg",         g: [2, -3],   r: [3, 3], seconds: 4.3,     notes: "" },
    { name: "tobolsk",           file: "chain_tobolsk.jpg",           g: [3, 3],    r: [4, 7], seconds: 4.2,     notes: "" },
    { name: "church",            file: "chain_church.jpg",            g: [4, 25],   r: [-4, 58], seconds: 14.2,   notes: "" },
    { name: "emir",              file: "chain_emir.jpg",              g: [24, 49],  r: [41, 106], seconds: 12.3,
      notes: "The one that direct matching could not do. Red onto green is only (17, 57), an easy comparison, and adding the green hop gets it within a pixel." },
    { name: "harvesters",        file: "chain_harvesters.jpg",        g: [17, 60],  r: [14, 125], seconds: 14.3,  notes: "" },
    { name: "icon",              file: "chain_icon.jpg",              g: [17, 41],  r: [22, 89], seconds: 13.7,   notes: "" },
    { name: "ilemselga",         file: "chain_ilemselga.jpg",         g: [7, 40],   r: [11, 131], seconds: 14.2,  notes: "" },
    { name: "melons",            file: "chain_melons.jpg",            g: [11, 82],  r: [15, 178], seconds: 13.2,  notes: "" },
    { name: "religous_painting", file: "chain_religous_painting.jpg", g: [3, 28],   r: [7, 69], seconds: 17.5,    notes: "" },
    { name: "self_portrait",     file: "chain_self_portrait.jpg",     g: [29, 79],  r: [37, 177], seconds: 13.0,  notes: "" },
    { name: "siren",             file: "chain_siren.jpg",             g: [-6, 49],  r: [-24, 96], seconds: 16.0,  notes: "" },
    { name: "three_generations", file: "chain_three_generations.jpg", g: [14, 53],  r: [11, 111], seconds: 14.9,  notes: "" },
    { name: "wharf",             file: "chain_wharf.jpg",             g: [-7, 15],  r: [-16, 82], seconds: 14.7,  notes: "" },

    { name: "Napoleon, waiting for peace (1905)", file: "chain_napoleon.jpg",
      g: [5, 63], r: [-2, 132], seconds: 13.0,
      sourceUrl: "https://www.loc.gov/item/2018681265/",
      notes: "My pick. A photograph of a painting, so nothing moved between exposures. The thin " +
             "cyan line is not a misalignment, it is a scratch that exists only on the red plate, " +
             "so the composite shows its absence as cyan." },
    { name: "Biological specimens in a display case (1905)", file: "chain_specimens.jpg",
      g: [-38, 41], r: [-81, 108], seconds: 14.4,
      sourceUrl: "https://www.loc.gov/item/2018681250/",
      notes: "My pick. About seventy compartments separated by thin white dividers, which makes it " +
             "a strict test: a pixel or two of error would fringe every divider in the picture." },
    { name: "Gospel of Metropolitan Iona, Rostov (1911)", file: "chain_gospel.jpg",
      g: [-12, 39], r: [-26, 86], seconds: 15.4,
      sourceUrl: "https://www.loc.gov/item/2018680793/",
      notes: "My pick. Gilt and enamel on plain white cloth, and the only one of my three that " +
             "moves left on both channels." },
  ],

  /* Anything that did not align cleanly, with the reason. */
  failures: [
    {
      name: "emir",
      file: "pyr_emir.jpg",
      what: "The red plate lands really far away from where it should, so the picture shows two " +
            "emirs stacked on top of each other with heavy red and cyan fringing everywhere.",
      why: "A big portion of the picture is emir's blue coat. Because it is so strongly blue, it " +
           "comes out bright in the blue plate and dark in the red one. The wall behind him is the " +
           "opposite, it is warm, so it is one of the brightest things in the red plate. The scoring " +
           "function does not know any of this. All it sees is that the coat stands out from its " +
           "surroundings in blue and the wall stands out from its surroundings in red, so it lines " +
           "those two up instead of lining up the subject. It is not that the search gave up too " +
           "early either, the peak really is sitting in the wrong place, and I confirmed that by " +
           "widening the refinement window, cropping more of the border and swapping NCC for SSD. " +
           "None of them moved it. The real fix is to stop comparing color intensities at all and " +
           "compare edges instead, which is the bells and whistles section below.",
    },
  ],

  /* Bells and whistles. Each entry renders a before/after drag slider. */
  bells: [
    {
      title: "Edge based matching: align on gradients instead of brightness",
      summary:
        "Chaining avoids the hard comparison. This instead makes it easy. An edge sits in the same " +
        "place whichever colour filter you shoot through, even when the brightness on either side " +
        "of it flips, so I match on gradient magnitude rather than raw intensity. The gradients come " +
        "from a derivative-of-Gaussian filter I build from the same 1-D Gaussian as the pyramid. " +
        "Nothing else changes: same search, same NCC, same pyramid, and " +
        "the saved picture is still made from the untouched plates. It puts emir at (40, 107), which " +
        "is exact.",
      before: "pyr_emir.jpg",
      after: "edge_emir.jpg",
    },
  ],
};
