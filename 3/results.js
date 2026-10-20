/* Project 3 data manifest. Everything on the page is rendered from here, so the
   captions and the figures cannot drift apart.

   Part A's figures were written as PNG by the notebook and converted to JPEG at
   quality 90 for the site, which took the set from 36 MB down to 7.6 MB with
   nothing visible lost. Part B's stay as PNG: they are plots and digit grids,
   where JPEG would ring around the axis text and the sharp stroke edges, and all
   nineteen come to under 1 MB anyway.

   Anything missing from ./media/ draws a dashed placeholder naming the file it
   wants, instead of failing silently. */

const RESULTS = {

  /* ---------------- the run itself ---------------- */

  run: [
    { name: "model", value: "PixNerd-XXL-P16-T2I", note: "pretrained, no training in Part A" },
    { name: "GPU", value: "Tesla T4", note: "peak memory 11.4 GiB" },
    { name: "seed", value: "180", note: "every figure below is reproducible from it" },
    { name: "Euler step size", value: "0.02", note: "50 updates across the full path" },
    { name: "guidance weight", value: "7", note: "Part A's convention, see 2.1" },
    { name: "Part B GPU", value: "Tesla T4", note: "PyTorch 2.11, a separate session from Part A" },
    { name: "Part B denoiser", value: "D = 128, batch 256, Adam 1e-4, 5 epochs", note: "6.86M parameters, trained at sigma = 0.5 only" },
    { name: "Part B flow models", value: "D = 64, batch 64, 10 epochs", note: "lr 1e-2, decayed by 0.1 ** (1/10) each epoch" },
    { name: "Part B class sampling", value: "300 Euler steps, guidance 5.0", note: "Part B's convention, see 2.6" },
  ],

  /* ---------------- numerical checks ---------------- */

  checksA: [
    { name: "interpolate at t = 0", value: "exact", note: "returns the noise tensor unchanged" },
    { name: "interpolate at t = 1", value: "exact", note: "returns the clean image unchanged" },
    { name: "Euler steps from t = 0, h = 0.02", value: "50", note: "lands on t = 1 exactly" },
    { name: "Euler steps from t = 0.50", value: "25", note: "the run used for 1.5" },
    { name: "Euler steps from t = 0.93", value: "4", note: "three full steps then one of 0.01" },
    { name: "CFG at w = 0 against the plain conditional", value: "exact", note: "guidance collapses to the conditional prediction" },
    { name: "rotate180 applied twice", value: "exact", note: "the transform is its own inverse" },
  ],

  /* Mean squared error against the original, straight out of metrics.json. */
  reconstruction: [
    { name: "Gaussian blur", value: "0.0199", note: "the classical baseline from 1.2" },
    { name: "one step", value: "0.0031", note: "a single velocity prediction, 1.3" },
    { name: "25 Euler steps", value: "0.0041", note: "iterative denoising, 1.5" },
  ],

  checksB: [
    { name: "denoiser training loss, final", value: "about 0.010", note: "sigma = 0.5, five epochs; read off the curve, the run never printed it" },
    { name: "pure-noise training loss, final", value: "about 0.068", note: "the floor set by dataset variance; also read off the curve" },
    { name: "class-conditioned, last 200 steps, with scheduler", value: "0.0869", note: "1e-2 decaying a decade over ten epochs" },
    { name: "class-conditioned, last 200 steps, constant rate", value: "0.0875", note: "the ablation, held at 1e-3" },
  ],

  /* ---------------- Part A ---------------- */

  a11: [
    { file: "training_inputs.jpg", pending: "training_inputs.jpg",
      caption: "my Freddy plush, then the same image at t = 0.25, 0.50 and 0.75",
      note: "one noise tensor reused at all three times, so the only thing changing is how much of it is left" },
  ],

  a12: [
    { file: "blur_0.25.jpg", pending: "blur_0.25.jpg", caption: "t = 0.25, noisy against the best blur" },
    { file: "blur_0.5.jpg", pending: "blur_0.5.jpg", caption: "t = 0.50" },
    { file: "blur_0.75.jpg", pending: "blur_0.75.jpg", caption: "t = 0.75, the least noise to remove" },
  ],

  a13: [
    { file: "one_step_0.25.jpg", pending: "one_step_0.25.jpg", caption: "t = 0.25: original, noisy, one-step estimate" },
    { file: "one_step_0.5.jpg", pending: "one_step_0.5.jpg", caption: "t = 0.50" },
    { file: "one_step_0.75.jpg", pending: "one_step_0.75.jpg", caption: "t = 0.75" },
  ],

  a14original: [
    { file: "velocity_original.jpg", pending: "velocity_original.jpg",
      caption: "the image every error map below is measured against" },
  ],

  a14: [
    { file: "velocity_0.25.jpg", pending: "velocity_0.25.jpg",
      caption: "t = 0.25: noisy input, predicted update, ground truth update, per-pixel RGB RMS error" },
    { file: "velocity_0.50.jpg", pending: "velocity_0.50.jpg", caption: "t = 0.50" },
    { file: "velocity_0.75.jpg", pending: "velocity_0.75.jpg", caption: "t = 0.75" },
  ],

  a15: [
    { file: "trajectory.jpg", pending: "trajectory.jpg",
      caption: "starting at t = 0.50, then every fifth update, ending at t = 1",
      note: "six states out of twenty five updates" },
    { file: "comparison.jpg", pending: "comparison.jpg",
      caption: "the same noisy input handled three ways: blur, one step, and 25 Euler steps" },
  ],

  a16panel: [
    { file: "conditional_samples.jpg", pending: "conditional_samples.jpg",
      caption: "five independent noise tensors integrated from t = 0 to t = 1 with \"a high quality photo\"",
      note: "every one is a person, and three of the five are anatomically broken" },
  ],

  a16: [
    { file: "conditional_0.jpg", pending: "conditional_0.jpg", caption: "seed 180, no face at all" },
    { file: "conditional_1.jpg", pending: "conditional_1.jpg", caption: "seed 181, distorted torso" },
    { file: "conditional_2.jpg", pending: "conditional_2.jpg", caption: "seed 182, the one clean portrait" },
    { file: "conditional_3.jpg", pending: "conditional_3.jpg", caption: "seed 183, melted features" },
    { file: "conditional_4.jpg", pending: "conditional_4.jpg", caption: "seed 184, mostly coherent" },
  ],

  a21panel: [
    { file: "cfg_samples.jpg", pending: "cfg_samples.jpg",
      caption: "the same five seeds, now with classifier-free guidance at w = 7",
      note: "all five are now clean, and all five are centred headshots" },
  ],

  a21: [
    { file: "cfg_0.jpg", pending: "cfg_0.jpg", caption: "seed 180, which had no face without guidance" },
    { file: "cfg_1.jpg", pending: "cfg_1.jpg", caption: "seed 181, the distorted torso resolved" },
    { file: "cfg_2.jpg", pending: "cfg_2.jpg", caption: "seed 182" },
    { file: "cfg_3.jpg", pending: "cfg_3.jpg", caption: "seed 183, the melted face resolved" },
    { file: "cfg_4.jpg", pending: "cfg_4.jpg", caption: "seed 184" },
  ],

  a31: [
    { file: "edit_campanile.jpg", pending: "edit_campanile.jpg",
      caption: "the Campanile, then seven starting times from 0.02 to 0.50",
      note: "the architectural detail comes back last, from t = 0.25 onward" },
    { file: "edit_my_image_1.jpg", pending: "edit_my_image_1.jpg", caption: "the Freddy plush, same seven times" },
    { file: "edit_my_image_2.jpg", pending: "edit_my_image_2.jpg",
      caption: "the Bonnie plush, same seven times",
      note: "at t = 0.02 and 0.04 it becomes a purple phone and a purple box, keeping the colour and losing the subject" },
  ],

  a31creative: [
    { file: "edit_web_image.jpg", pending: "edit_web_image.jpg",
      caption: "Hokusai's Great Wave, from the web",
      note: "below t = 0.10 it collapses into stock photography, a woman at a laptop and then a robot vacuum" },
    { file: "edit_drawing_1.jpg", pending: "edit_drawing_1.jpg", caption: "my drawing of a wave" },
    { file: "edit_drawing_2.jpg", pending: "edit_drawing_2.jpg",
      caption: "my drawing of a house",
      note: "the two lowest times give portraits on a white background, the only thing kept being the layout" },
  ],

  a32: [
    { file: "text_edit_campanile.jpg", pending: "text_edit_campanile.jpg",
      caption: "Campanile, prompted \"A photograph lighthouse at dusk\"",
      note: "the cleanest result of the three, since a lighthouse and a bell tower share a silhouette" },
    { file: "text_edit_my_image_1.jpg", pending: "text_edit_my_image_1.jpg",
      caption: "Freddy, prompted \"A realistic animatronic bear\"" },
    { file: "text_edit_my_image_2.jpg", pending: "text_edit_my_image_2.jpg",
      caption: "Bonnie, prompted \"A realistic animatronic bunny\"" },
  ],

  a33: [
    { file: "anagram_views_0.jpg", pending: "anagram_views_0.jpg",
      caption: "an oil painting of a bearded sailor, and the same image turned over, a sailing ship in a storm" },
    { file: "anagram_views_1.jpg", pending: "anagram_views_1.jpg",
      caption: "a lithograph of a stag, and turned over, a snowy forest at dusk" },
  ],

  /* flip: true turns these over on hover, and adds a latching button for touch
     screens. Only the single full-size images get it. The anagram_views panels
     above are composites that already show both orientations side by side, so
     rotating one of those would just turn both readings upside down. */
  a33full: [
    { file: "anagram_0.jpg", pending: "anagram_0.jpg", flip: true,
      caption: "a bearded sailor, or a sailing ship in a storm",
      note: "hover to turn it over, or use the flip button to latch it" },
    { file: "anagram_1.jpg", pending: "anagram_1.jpg", flip: true,
      caption: "a stag, or a snowy forest at dusk",
      note: "hover to turn it over, or use the flip button to latch it" },
  ],

  a34: [
    { file: "hybrid_0.jpg", pending: "hybrid_0.jpg",
      caption: "close prompt \"a lithograph of a swarm of bees\", distant prompt \"a lithograph of a human skull\"" },
    { file: "hybrid_1.jpg", pending: "hybrid_1.jpg",
      caption: "close prompt \"a lithograph of cracked dry earth\", distant prompt \"a lithograph of a bearded man's face\"" },
  ],

  /* The notebook only displayed the reduced view inline and never saved it, so
     these were made afterwards from the saved full-size images with the same
     LANCZOS resize. Four scales instead of one, because which scale you look at
     is the whole argument in 3.4. Upscaled back with nearest neighbour so no
     detail is interpolated in. */
  a34far: [
    { file: "hybrid_0_far.jpg", pending: "hybrid_0_far.jpg",
      caption: "skull and bees at 64, 32, 24 and 16 pixels",
      note: "the bees hold the 64 view; the skull arrives by 24" },
    { file: "hybrid_1_far.jpg", pending: "hybrid_1_far.jpg",
      caption: "face and cracked earth at the same four scales",
      note: "the face holds every scale, which is the failure" },
  ],

  /* ---------------- Part B ---------------- */

  b12noise: [
    { file: "noising_levels.png", pending: "noising_levels.png",
      caption: "one test digit at sigma = 0, 0.2, 0.4, 0.5, 0.6, 0.8, 1.0",
      note: "z = x + sigma * eps, with one epsilon reused across the row" },
  ],

  b121: [
    { file: "denoiser_sigma0p5_loss.png", pending: "denoiser_sigma0p5_loss.png", caption: "training loss, five epochs" },
    { file: "denoise_epoch1.png", pending: "denoise_epoch1.png", caption: "after one epoch: clean, noisy, denoised" },
    { file: "denoise_epoch5.png", pending: "denoise_epoch5.png", caption: "after five epochs, same eight test digits" },
  ],

  b122: [
    { file: "ood_sigma_sweep.png", pending: "ood_sigma_sweep.png",
      caption: "the sigma = 0.5 model pushed across all seven noise levels",
      note: "rows run in pairs, noisy then denoised, one pair per sigma" },
  ],

  b123: [
    { file: "purenoise_loss.png", pending: "purenoise_loss.png", caption: "training loss when the input carries no information" },
    { file: "purenoise_epoch1.png", pending: "purenoise_epoch1.png", caption: "output from pure noise after one epoch" },
    { file: "purenoise_epoch5.png", pending: "purenoise_epoch5.png", caption: "after five epochs, flatter and greyer than after one" },
  ],

  b22: [
    { file: "time_conditioned_loss.png", pending: "time_conditioned_loss.png",
      caption: "time-conditioned training loss over ten epochs",
      note: "lr 1e-2 decaying a decade across the run; the per-epoch steps are too small to see at this scale" },
  ],

  b23: [
    { file: "time_samples_epoch1.png", pending: "time_samples_epoch1.png", caption: "after one epoch" },
    { file: "time_samples_epoch5.png", pending: "time_samples_epoch5.png", caption: "after five epochs" },
    { file: "time_samples_epoch10.png", pending: "time_samples_epoch10.png", caption: "after ten epochs, 50 Euler steps" },
  ],

  b25: [
    { file: "class_loss.png", pending: "class_loss.png", caption: "class-conditioned training, with the scheduler" },
    { file: "class_nosched_loss.png", pending: "class_nosched_loss.png", caption: "the ablation, constant rate, no scheduler" },
  ],

  b26: [
    { file: "class_samples_epoch1.png", pending: "class_samples_epoch1.png", caption: "after one epoch" },
    { file: "class_samples_epoch5.png", pending: "class_samples_epoch5.png", caption: "after five epochs" },
    { file: "class_samples_epoch10.png", pending: "class_samples_epoch10.png",
      caption: "after ten epochs, guidance 5.0, 300 steps",
      note: "four rows, each a full sweep of the digits 0 through 9" },
  ],

  b26ablation: [
    { file: "class_samples_nosched.png", pending: "class_samples_nosched.png",
      caption: "the no-scheduler model at ten epochs, same seed and same digit order" },
    { file: "class_trajectory.png", pending: "class_trajectory.png",
      caption: "one sampling trajectory, noise on the left and a digit on the right" },
  ],

};
