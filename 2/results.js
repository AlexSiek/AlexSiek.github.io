/* Project 2 data manifest. Everything on the page is rendered from here, so
   the numbers in the write up and the numbers the code printed cannot drift
   apart. Items with an empty `file` render as a dashed placeholder showing the
   filename they are waiting for. */

const RESULTS = {

  /* Part 1.1 timings, all measured on the same 225 x 169 image with a 9x9 box. */
  timing: [
    { name: "four nested loops", seconds: 1.414, note: "one Python iteration per pixel per kernel tap" },
    { name: "two loops over the kernel", seconds: 0.005, note: "300x faster, numpy does the per pixel work" },
    { name: "scipy.signal.convolve2d", seconds: 0.007, note: "not separable aware, so it loses to the vectorised version here" },
  ],

  /* ---------------- figure groups ---------------- */

  conv: [
    { file: "p11_original.jpg", caption: "my photo, read as greyscale" },
    { file: "p11_box9.jpg", caption: "9x9 box filter, a plain average over a square window" },
    { file: "p11_dx.jpg", caption: "D_x = [1, 0, -1], vertical edges survive" },
    { file: "p11_dy.jpg", caption: "D_y = [1, 0, -1] transposed, horizontal edges survive" },
    { file: "p11_full.jpg", caption: "\"full\" padding, 8 pixels larger in each direction, note the dark fringe" },
  ],

  finiteDiff: [
    { file: "p12_cameraman.jpg", caption: "cameraman" },
    { file: "p12_dx.jpg", caption: "partial derivative in x" },
    { file: "p12_dy.jpg", caption: "partial derivative in y" },
    { file: "p12_magnitude.jpg", caption: "gradient magnitude, sqrt(dx^2 + dy^2)" },
  ],

  thresholds: [
    { file: "p12_edges_020.jpg", caption: "threshold 0.20", note: "grass is pure static" },
    { file: "p12_edges_025.jpg", caption: "threshold 0.25" },
    { file: "p12_edges_030.jpg", caption: "threshold 0.30", note: "what I chose" },
    { file: "p12_edges_035.jpg", caption: "threshold 0.35" },
    { file: "p12_edges_045.jpg", caption: "threshold 0.45", note: "tripod legs start breaking up" },
  ],

  dog: [
    { file: "p13_blurred.jpg", caption: "Gaussian blurred first, sigma 1.4" },
    { file: "p13_twostep_mag.jpg", caption: "route one: blur, then finite difference" },
    { file: "p13_dog_mag.jpg", caption: "route two: one convolution with the DoG filter" },
    { file: "p13_dog_dx.jpg", caption: "DoG in x applied to the image" },
    { file: "p13_dog_dy.jpg", caption: "DoG in y applied to the image" },
    { file: "p13_edges_012.jpg", caption: "binarised at 0.12, well below what part 1.2 needed" },
  ],

  sharpenTaj: [
    { file: "p21_taj_original.jpg", caption: "original" },
    { file: "p21_taj_blurred.jpg", caption: "Gaussian blur, sigma 2, the low frequencies" },
    { file: "p21_taj_highfreq.jpg", caption: "original minus blur, the high frequencies, contrast stretched" },
    { file: "p21_taj_a10.jpg", caption: "sharpened, alpha = 1" },
  ],

  sharpenAlpha: [
    { file: "p21_taj_a05.jpg", caption: "alpha = 0.5" },
    { file: "p21_taj_a10.jpg", caption: "alpha = 1" },
    { file: "p21_taj_a20.jpg", caption: "alpha = 2" },
    { file: "p21_taj_a40.jpg", caption: "alpha = 4, haloes around every edge" },
  ],

  sharpenMine: [
    { file: "p21_mine_original.jpg", caption: "my photo, dark and noisy straight off the phone" },
    { file: "p21_mine_blurred.jpg", caption: "Gaussian blur, sigma 2" },
    { file: "p21_mine_highfreq.jpg", caption: "the high frequencies, contrast stretched" },
    { file: "p21_mine_a10.jpg", caption: "sharpened, alpha = 1" },
    { file: "p21_mine_a20.jpg", caption: "alpha = 2, the noise comes up with the detail" },
  ],

  sharpenTahoe: [
    { file: "p21_tahoe_original.jpg", caption: "original, daylight and in focus" },
    { file: "p21_tahoe_blurred.jpg", caption: "Gaussian blur, sigma 2" },
    { file: "p21_tahoe_highfreq.jpg", caption: "the high frequencies, contrast stretched" },
    { file: "p21_tahoe_a10.jpg", caption: "sharpened, alpha = 1" },
    { file: "p21_tahoe_a20.jpg", caption: "alpha = 2, haloes along the railing" },
  ],

  hybrids: [
    { file: "p22_derek_nutmeg_high.jpg", caption: "Derek, aligned. The high frequency half" },
    { file: "p22_derek_nutmeg_low.jpg", caption: "Nutmeg, aligned on the same two eye points" },
    { file: "p22_derek_nutmeg_hybrid.jpg", caption: "the hybrid at full size, both blurs equal" },
    { file: "p22_derek_nutmeg_far.jpg", caption: "the same image shrunk, which is the far away view" },
  ],

  hybridsMine: [
    { file: "p22_mine1_high.jpg", caption: "the scrunched take, the close up half" },
    { file: "p22_mine1_low.jpg", caption: "the relaxed take, the far away half" },
    { file: "p22_mine1_hybrid.jpg", caption: "hybrid, sigma 4 over sigma 10" },
    { file: "p22_mine1_far.jpg", caption: "shrunk, and the expression relaxes" },
  ],

  hybridsAnimals: [
    { file: "p22_mine2_high.jpg", caption: "the cat, the close up half" },
    { file: "p22_mine2_low.jpg", caption: "the lion, lifted to match, the far away half" },
    { file: "p22_mine2_hybrid.jpg", caption: "hybrid, sigma 3 over sigma 3" },
    { file: "p22_mine2_far.jpg", caption: "shrunk, and the ear tufts go" },
  ],

  blends: [
    { file: "p24_apple.jpg", caption: "apple" },
    { file: "p24_orange.jpg", caption: "orange" },
    { file: "p24_mask.jpg", caption: "the mask, a step function" },
    { file: "p24_naive.jpg", caption: "cutting along the seam, the join is obvious" },
    { file: "p24_oraple.jpg", caption: "multiresolution blend, no visible seam" },
  ],

  customBlends: [
    { file: "p24_blend1_a.jpg", caption: "my dear friend Chris" },
    { file: "p24_blend1_b.jpg", caption: "my other dear friend Kavin" },
    { file: "p24_blend1_naive.jpg", caption: "cut and paste, seam down the middle" },
    { file: "p24_blend1_blended.jpg", caption: "multiresolution blend, Chivin" },
  ],

  irregularBlend: [
    { file: "p24_blend2_a.jpg", caption: "the honeycomb side of the bottle" },
    { file: "p24_blend2_b.jpg", caption: "the smooth side, same bottle, same desk" },
    { file: "p24_blend2_mask.jpg", caption: "the mask, a circle rather than a straight line" },
    { file: "p24_blend2_naive.jpg", caption: "cut and paste, and the circle is obvious" },
    { file: "p24_blend2_blended.jpg", caption: "multiresolution blend, the patch has no edge" },
  ],

};
