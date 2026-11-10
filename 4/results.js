/* Project 4 data manifest. Everything on the page is rendered from here, so the
   captions and the figures cannot drift apart.

   Every entry names the file it wants, so dropping an image into ./media/ under
   that name makes the figure appear with no edit here, and anything missing
   draws a dashed placeholder naming the file instead of failing silently.

   Naming convention, so the files sort sensibly in a folder:
     set<N>_<a|b|c>.jpg        the source photographs for image set N
     corr_set<N>.jpg           correspondences drawn on the pair
     rect_<N>_before|after.jpg a rectification, source and result
     warp_nn|bilinear.jpg      the same warp under both interpolators
     detail_nn|bilinear.jpg    a crop of the above, for the pixel-level look
     mosaic_<N>.jpg            a finished mosaic
     mosaic_<N>_naive.jpg      the same mosaic with a hard seam, for comparison

   Part B files all carry a b_ prefix, so the two halves of the project stay
   apart in the folder and a Part A figure is never overwritten by its
   automatic counterpart.

   JPEG throughout, matching projects 1, 2 and 3. These are photographs, so
   that is the right container. */

const RESULTS = {

  /* ---------------- the run itself ---------------- */

  run: [
    { name: "camera", value: "phone, handheld", note: "5712 by 3213, HEIC, converted to JPEG first" },
    { name: "capture method", value: "turned on the spot", note: "no tripod, see the rotation check in A.1" },
    { name: "working resolution", value: "1200 px on the long side", note: "coordinates are given at full size and scaled to match" },
    { name: "correspondences per pair", value: "4", note: "the minimum, and a known shortfall; see A.2" },
    { name: "point picking", value: "by hand, pixspy.com", note: "typed into points.py, no clicking tool" },
    { name: "interpolation", value: "bilinear", note: "nearest neighbour kept alongside it for the A.3 comparison" },
    { name: "blending", value: "two band", note: "cross fade the blur, hard cut the detail" },
  ],

  /* ---------------- A.1 the photographs ---------------- */

  a1set1: [
    { file: "set1_a.jpg", pending: "set1_a.jpg", caption: "cafe entrance, left",
      note: "the merchandise case, with the doorway at the right edge" },
    { file: "set1_b.jpg", pending: "set1_b.jpg", caption: "cafe entrance, centre",
      note: "the same doorway at the left edge, then the gate" },
  ],

  a1set2: [
    { file: "set2_a.jpg", pending: "set2_a.jpg", caption: "corridor, left" },
    { file: "set2_b.jpg", pending: "set2_b.jpg", caption: "corridor, centre",
      note: "the reference frame, it stays where it is" },
    { file: "set2_c.jpg", pending: "set2_c.jpg", caption: "corridor, right" },
  ],

  a1set3: [
    { file: "set3_a.jpg", pending: "set3_a.jpg", caption: "mailroom, left" },
    { file: "set3_b.jpg", pending: "set3_b.jpg", caption: "mailroom, centre",
      note: "the reference frame" },
    { file: "set3_c.jpg", pending: "set3_c.jpg", caption: "mailroom, right" },
  ],

  /* ---------------- A.2 homographies ---------------- */

  a2corr: [
    { file: "corr_set1.jpg", pending: "corr_set1.jpg",
      caption: "set 1, the picked correspondences on both frames",
      note: "numbered so a mismatched pair is visible rather than silent" },
    { file: "corr_set2.jpg", pending: "corr_set2.jpg", caption: "set 2, the picked correspondences" },
    { file: "corr_set3.jpg", pending: "corr_set3.jpg", caption: "set 3, the picked correspondences" },
    { file: "corr_rect1.jpg", pending: "corr_rect1.jpg",
      caption: "the rectification target, four corners against a known rectangle" },
  ],

  /* The recovered matrices, straight out of computeH. Five of them, because
     each three frame mosaic needs one per outer frame. */
  a2matrices: [
    { caption: "cafe: left frame onto the centre",
      rows: [[5.167595, 0.135447, -3717.420535],
             [1.069659, 4.155669, -923.364049],
             [0.003461, -0.000072, 1.0]],
      note: "the large h31 is a 43 degree turn, which is what stretches mosaic 1" },
    { caption: "corridor: left frame onto the centre",
      rows: [[2.066758, 0.032123, -932.719155],
             [0.274344, 1.738711, -255.900895],
             [0.000870, 0.000047, 1.0]] },
    { caption: "corridor: right frame onto the centre",
      rows: [[0.565909, -0.004605, 369.188889],
             [-0.112680, 0.837052, 37.916004],
             [-0.000371, 0.000005, 1.0]] },
    { caption: "mailroom: left frame onto the centre",
      rows: [[2.281314, 0.123868, -1132.963186],
             [0.257801, 1.931986, -327.770806],
             [0.001026, 0.000150, 1.0]] },
    { caption: "mailroom: right frame onto the centre",
      rows: [[0.531089, -0.057456, 437.178392],
             [-0.119448, 0.821959, 42.605337],
             [-0.000396, -0.000035, 1.0]],
      note: "h33 is 1 in every one of them, because the solve fixes it" },
  ],

  checksA2: [
    { name: "correspondences per pair", value: "4", note: "the minimum, so the system is exactly determined" },
    { name: "reprojection error, every pair", value: "0.00 px",
      note: "exact by construction with 4 points, so it measures nothing" },
    { name: "H times H inverse against identity", value: "exact",
      note: "round trip through the solve, to 1e-14" },
    { name: "overlap agreement, cafe", value: "23.1 raw, 9.5 structural, out of 255",
      note: "almost all of the raw figure is an exposure step, not misalignment" },
    { name: "overlap agreement, corridor", value: "5.3 and 8.9 raw, 2.8 and 4.9 structural",
      note: "left onto centre, then right onto centre; mostly blank wall, which flatters the structural figure" },
    { name: "overlap agreement, mailroom", value: "13.5 and 16.3 raw, 11.6 and 15.4 structural",
      note: "the smallest exposure difference of any set, and the structure column is doing the talking; see A.4" },
  ],

  /* ---------------- A.3 warping ---------------- */

  a3rect: [
    { file: "rect_1_before.jpg", pending: "rect_1_before.jpg",
      caption: "window blinds, shot at an angle" },
    { file: "rect_1_after.jpg", pending: "rect_1_after.jpg",
      caption: "the same blinds rectified",
      note: "the slats are parallel now, and evenly spaced top to bottom" },
    { file: "rect_2_before.jpg", pending: "rect_2_before.jpg",
      caption: "a door at the end of a corridor" },
    { file: "rect_2_after.jpg", pending: "rect_2_after.jpg",
      caption: "the same door rectified",
      note: "the whole corridor comes with it, which is why the shelving skews" },
  ],

  a3interp: [
    { before: "warp_nn.jpg", after: "warp_bilinear.jpg",
      beforeLabel: "nearest", afterLabel: "bilinear",
      caption: "the same warp under both interpolators",
      note: "Turn the magnifier on first; at page scale the two are hard to tell apart." },
  ],

  a3detail: [
    { file: "detail_nn.jpg", pending: "detail_nn.jpg",
      caption: "nearest neighbour, crop at full resolution",
      note: "look along a high-contrast diagonal edge" },
    { file: "detail_bilinear.jpg", pending: "detail_bilinear.jpg",
      caption: "bilinear, the same crop" },
  ],

  checksA3: [
    { name: "warp under the identity homography", value: "exact",
      note: "returns the input bit for bit, both interpolators" },
    { name: "output size of the blinds rectification", value: "809 by 1605",
      note: "from the four warped corners, plus the margin that keeps the room" },
    { name: "nearest neighbour, time to warp", value: "211 ms",
      note: "at 1200 px on the long side" },
    { name: "bilinear, time to warp", value: "456 ms", note: "2.2 times slower, same image" },
    { name: "mean difference between the two", value: "2.04 out of 255",
      note: "in intensity, with a worst case of 112 on a hard edge" },
  ],

  /* ---------------- A.4 mosaics ---------------- */

  a4sources: [
    { file: "set1_a.jpg", pending: "set1_a.jpg", caption: "mosaic 1, cafe entrance, left" },
    { file: "set1_b.jpg", pending: "set1_b.jpg", caption: "mosaic 1, centre, the reference" },
    { file: "set2_a.jpg", pending: "set2_a.jpg", caption: "mosaic 2, corridor, left" },
    { file: "set2_b.jpg", pending: "set2_b.jpg", caption: "mosaic 2, centre, the reference" },
    { file: "set2_c.jpg", pending: "set2_c.jpg", caption: "mosaic 2, right" },
    { file: "set3_a.jpg", pending: "set3_a.jpg", caption: "mosaic 3, mailroom, left" },
    { file: "set3_b.jpg", pending: "set3_b.jpg", caption: "mosaic 3, centre, the reference" },
    { file: "set3_c.jpg", pending: "set3_c.jpg", caption: "mosaic 3, right" },
  ],

  a4mosaics: [
    { file: "mosaic_1.jpg", pending: "mosaic_1.jpg",
      caption: "mosaic 1, cafe entrance, two frames 43 degrees apart",
      note: "the wedge is what a planar mosaic costs at that angle" },
    { file: "mosaic_2.jpg", pending: "mosaic_2.jpg",
      caption: "mosaic 2, corridor junction, three frames",
      note: "the deepest scene of the three, and it holds together through both joins" },
    { file: "mosaic_3.jpg", pending: "mosaic_3.jpg",
      caption: "mosaic 3, mailroom, three frames",
      note: "one flat wall, which should have been the easy case and was not" },
  ],

  a4blend: [
    { before: "mosaic_1_naive.jpg", after: "mosaic_1.jpg",
      beforeLabel: "overwritten", afterLabel: "two band",
      caption: "mosaic 1, one frame laid over the other against blending them",
      note: "The join to look for runs down the middle of the overlap." },
  ],

  /* ======================== PART B ========================

     Same photographs, same solver, same blending. The only thing that changes
     is where the correspondences come from, so every figure below has a Part A
     counterpart above it.

     Naming, continuing the convention:
       b_corners_<stem>.jpg      every Harris corner beside the ones ANMS keeps
       b_descriptors.jpg         a spread of the normalised 8 by 8 patches
       b_descriptor_windows.jpg  the 40 by 40 windows those came from
       b_matches_<join>.jpg      both frames with a line across every match
       b_mosaic_<N>.jpg          the automatic mosaic, no clicking involved  */

  /* ---------------- the Part B run ---------------- */

  runB: [
    { name: "corner detector", value: "Harris, from the provided harris.py",
      note: "one scale, no sub pixel refinement, 20 px edge discard" },
    { name: "candidates before ANMS", value: "3000",
      note: "ANMS is quadratic in the candidate count, so the weak tail goes first" },
    { name: "corners kept by ANMS", value: "500", note: "the paper's n_ip" },
    { name: "c_robust", value: "0.9",
      note: "a neighbour has to be 1/0.9 times as strong before it suppresses a point" },
    { name: "descriptor", value: "8 by 8 from a 40 by 40 window",
      note: "every fifth pixel, after a sigma 2.0 blur" },
    { name: "normalisation", value: "zero mean, unit deviation",
      note: "an exposure difference between the frames cancels exactly" },
    { name: "ratio test threshold", value: "0.64 on squared errors",
      note: "Lowe's familiar 0.8 is on distances; the paper's figure 6b plots squared errors" },
    { name: "mutual nearest neighbour", value: "required",
      note: "the handout does not ask for it, and the distance matrix already exists" },
    { name: "RANSAC tolerance", value: "3.0 px", note: "at the 1200 px working resolution" },
    { name: "RANSAC budget", value: "2000 draws, adaptive",
      note: "99 per cent confidence; between 15 and 40 draws were actually taken" },
    { name: "seed", value: "0", note: "so the figures and the numbers reproduce" },
  ],

  /* ---------------- B.1 corners and ANMS ---------------- */

  b1corners: [
    { file: "b_corners_set1_a.jpg", pending: "b_corners_set1_a.jpg",
      caption: "cafe entrance, left: 3000 Harris corners, then the 500 ANMS keeps",
      note: "the red cloud piles onto the posters and the merchandise case, the green one reaches the door, the panelling and the floor tiles" },
    { file: "b_corners_set1_b.jpg", pending: "b_corners_set1_b.jpg",
      caption: "cafe entrance, centre: the same two panels" },
    { file: "b_corners_set2_b.jpg", pending: "b_corners_set2_b.jpg",
      caption: "corridor, centre frame",
      note: "mostly blank wall, so even the unsuppressed corners are less clumped than the others" },
    { file: "b_corners_set3_a.jpg", pending: "b_corners_set3_a.jpg",
      caption: "mailroom, left",
      note: "the mailbox grid is a repeating pattern, which matters again in B.3" },
  ],

  b1spread: [
    { name: "set1_a, cafe left", value: "6.3 px becomes 17.3 px",
      note: "every kept corner is at least 17.7 px from a stronger one" },
    { name: "set1_b, cafe centre", value: "6.8 px becomes 15.7 px",
      note: "smallest kept radius 14.4 px" },
    { name: "set2_b, corridor centre", value: "6.1 px becomes 14.9 px",
      note: "smallest kept radius 12.4 px" },
    { name: "set3_a, mailroom left", value: "6.9 px becomes 15.9 px",
      note: "smallest kept radius 19.4 px" },
  ],

  /* ---------------- B.2 descriptors ---------------- */

  b2desc: [
    { file: "b_descriptors.jpg", pending: "b_descriptors.jpg",
      caption: "24 of the 500 descriptors from the cafe left frame",
      note: "taken at regular intervals through the list rather than off the top, which would all sit on one object" },
    { file: "b_descriptor_windows.jpg", pending: "b_descriptor_windows.jpg",
      caption: "the 40 by 40 windows those 24 came from",
      note: "each 8 by 8 patch above is this window blurred and then sampled every fifth pixel" },
  ],

  checksB2: [
    { name: "descriptors extracted", value: "500 of 500 corners",
      note: "the 20 px edge discard is half the window, so every surviving corner has a full patch" },
    { name: "descriptor length", value: "64", note: "an 8 by 8 patch, flattened" },
    { name: "largest mean among all 500", value: "0.0",
      note: "zero mean by construction, to floating point" },
    { name: "mean norm squared", value: "64.0", note: "unit deviation over 64 numbers" },
    { name: "a brightness and contrast change cancels", value: "exact",
      note: "to 1e-13, after the epsilon was fixed; the story is below" },
    { name: "40 px window against a raw 8 px crop", value: "30.5 against 110.3",
      note: "squared descriptor distance under a deliberate 2 px detector slip, so the wide window is 3.6 times steadier" },
  ],

  /* ---------------- B.3 matching ---------------- */

  b3matches: [
    { file: "b_matches_set1.jpg", pending: "b_matches_set1.jpg",
      caption: "cafe, left against centre: 39 matches, 29 of them green",
      note: "green is what RANSAC accepted, red is what the ratio test proposed and the geometry threw out" },
    { file: "b_matches_set2ab.jpg", pending: "b_matches_set2ab.jpg",
      caption: "corridor, left against centre: 33 matches, 19 green",
      note: "the thinnest consensus of the five, and the join with the least texture in its overlap" },
    { file: "b_matches_set2cb.jpg", pending: "b_matches_set2cb.jpg",
      caption: "corridor, right against centre: 99 matches, 75 green" },
    { file: "b_matches_set3ab.jpg", pending: "b_matches_set3ab.jpg",
      caption: "mailroom, left against centre: 72 matches, 53 green" },
    { file: "b_matches_set3cb.jpg", pending: "b_matches_set3cb.jpg",
      caption: "mailroom, right against centre: 47 matches, 36 green",
      note: "the inliers all run at the same shallow slope; most of the red lines cross between one row of mailboxes and a different row" },
  ],

  checksB3: [
    { name: "cafe, left onto centre", value: "39",
      note: "500 descriptors against 500, so a quarter of a million candidate pairs" },
    { name: "corridor, left onto centre", value: "33" },
    { name: "corridor, right onto centre", value: "99" },
    { name: "mailroom, left onto centre", value: "72" },
    { name: "mailroom, right onto centre", value: "47" },
    { name: "time to match one pair", value: "9.5 to 12.1 ms",
      note: "the whole distance matrix, then a partial sort for the two nearest" },
  ],

  /* ---------------- B.4 RANSAC and the mosaics ---------------- */

  checksB4: [
    { name: "cafe, left onto centre", value: "29 of 39, 74%",
      note: "19 draws, 1 refit pass, residual 1.02 px mean and 2.29 px worst" },
    { name: "corridor, left onto centre", value: "19 of 33, 58%",
      note: "40 draws, no refit pass needed, residual 0.77 and 1.68" },
    { name: "corridor, right onto centre", value: "75 of 99, 76%",
      note: "19 draws, 1 refit pass, residual 0.99 and 2.73" },
    { name: "mailroom, left onto centre", value: "53 of 72, 74%",
      note: "32 draws, 3 refit passes, residual 1.19 and 3.08" },
    { name: "mailroom, right onto centre", value: "36 of 47, 77%",
      note: "15 draws, 1 refit pass, residual 1.19 and 3.10" },
    { name: "time to fit one homography", value: "3.2 to 5.4 ms",
      note: "including every draw that was thrown away" },
  ],

  /* The automatic matrices, beside the clicked ones in A.2 for comparison. */
  b4matrices: [
    { caption: "cafe: left frame onto the centre, from 29 RANSAC inliers",
      rows: [[4.243822, 0.128732, -3046.212432],
             [0.857097, 3.476237, -739.389731],
             [0.002692, -0.000023, 1.0]],
      note: "every entry differs from the clicked version in A.2, and the overlap still lines up about the same; B.4 has why" },
    { caption: "corridor: left frame onto the centre, from 19 inliers",
      rows: [[2.029338, 0.038128, -915.206458],
             [0.271741, 1.719860, -253.590979],
             [0.000840, 0.000054, 1.0]],
      note: "this one is close to the clicked matrix to three significant figures" },
    { caption: "corridor: right frame onto the centre, from 75 inliers",
      rows: [[0.572653, 0.001984, 366.068683],
             [-0.113330, 0.841646, 38.376064],
             [-0.000370, 0.000012, 1.0]] },
    { caption: "mailroom: left frame onto the centre, from 53 inliers",
      rows: [[2.314103, 0.136756, -1153.361582],
             [0.268764, 1.956391, -337.481648],
             [0.001044, 0.000159, 1.0]] },
    { caption: "mailroom: right frame onto the centre, from 36 inliers",
      rows: [[0.475311, -0.002303, 442.420408],
             [-0.133502, 0.829512, 46.119755],
             [-0.000445, 0.000024, 1.0]],
      note: "h33 is 1 again, since this is Part A's solver on a larger system" },
  ],

  b4mosaics: [
    { file: "mosaic_1.jpg", pending: "mosaic_1.jpg",
      caption: "mosaic 1, cafe entrance: four clicked points",
      note: "5011 by 2897" },
    { file: "b_mosaic_1.jpg", pending: "b_mosaic_1.jpg",
      caption: "mosaic 1, cafe entrance: 29 RANSAC inliers, nothing clicked",
      note: "4246 by 2368, so the automatic version stretches the outer frame noticeably less" },
    { file: "mosaic_2.jpg", pending: "mosaic_2.jpg",
      caption: "mosaic 2, corridor junction: clicked",
      note: "2819 by 1144" },
    { file: "b_mosaic_2.jpg", pending: "b_mosaic_2.jpg",
      caption: "mosaic 2, corridor junction: automatic",
      note: "2808 by 1127, within half a per cent of the clicked canvas" },
    { file: "mosaic_3.jpg", pending: "mosaic_3.jpg",
      caption: "mosaic 3, mailroom: clicked",
      note: "3194 by 1230" },
    { file: "b_mosaic_3.jpg", pending: "b_mosaic_3.jpg",
      caption: "mosaic 3, mailroom: automatic",
      note: "3324 by 1259, and the two surfaces A.4 found in that wall are still two surfaces" },
  ],

};
