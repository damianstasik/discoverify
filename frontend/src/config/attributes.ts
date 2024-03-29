export const attributes = [
  {
    name: "acousticness",
    label: "Acousticness",
    description:
      "A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic.",
    defaultMin: 0,
    defaultTarget: 0.5,
    defaultMax: 1,
    min: 0,
    max: 1,
    step: 0.05,
  },
  {
    label: "Danceability",
    name: "danceability",
    //description: 'Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable.',
    description:
      "The danceability filter helps you find music that is good for dancing. It works by looking at different musical elements like how fast the music is, how steady the rhythm is, and how strong the beat is. The filter gives each song a score between 0 and 1, with 1 being the most danceable and 0 being the least danceable. So, if you want to find music that will get you moving and grooving, use the danceability filter to find tracks with high danceability scores.",
    defaultMin: 0,
    defaultTarget: 0.5,
    defaultMax: 1,
    min: 0,
    max: 1,
    step: 0.05,
  },
  {
    name: "key",
    label: "Key",
    description:
      "The key the track is in. Integers map to pitches using standard Pitch Class notation. E.g. 0 = C, 1 = C♯/D♭, 2 = D, and so on. If no key was detected, the value is -1.",
    defaultMin: -1,
    defaultTarget: 6,
    defaultMax: 11,
    min: -1,
    max: 11,
    step: null,
    marks: [
      {
        value: -1,
        label: "N/A",
      },
      {
        value: 0,
        label: "C",
      },
      {
        value: 1,
        label: "C♯",
      },
      {
        value: 2,
        label: "D",
      },
      {
        value: 3,
        label: "D♯",
      },
      {
        value: 4,
        label: "E",
      },
      {
        value: 5,
        label: "F",
      },
      {
        value: 6,
        label: "F♯",
      },
      {
        value: 7,
        label: "G",
      },
      {
        value: 8,
        label: "G♯",
      },
      {
        value: 9,
        label: "A",
      },
      {
        value: 10,
        label: "A♯",
      },
      {
        value: 11,
        label: "B",
      },
    ],
  },
  {
    label: "Duration",
    name: "durationMs",
    description: "The duration of the track.",
    defaultMin: 0,
    defaultTarget: 10 * 60 * 1000,
    defaultMax: 20 * 60 * 1000,
    min: 0,
    max: 20 * 60 * 1000,
    step: 1000,
  },
  {
    label: "Energy",
    name: "energy",
    description:
      "Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy.",
    defaultMin: 0,
    defaultTarget: 0.5,
    defaultMax: 1,
    min: 0,
    max: 1,
    step: 0.05,
  },
  {
    label: "Instrumentalness",
    name: "instrumentalness",
    description:
      "Predicts whether a track contains no vocals. 'Ooh' and 'aah' sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly 'vocal'. The closer the instrumentalness value is to 1.0, the greater likelihood the track contains no vocal content. Values above 0.5 are intended to represent instrumental tracks, but confidence is higher as the value approaches 1.0.",
    defaultMin: 0,
    defaultTarget: 0.5,
    defaultMax: 1,
    min: 0,
    max: 1,
    step: 0.05,
  },
  {
    label: "Liveness",
    name: "liveness",
    description:
      "Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live. A value above 0.8 provides strong likelihood that the track is live.",
    defaultMin: 0,
    defaultTarget: 0.5,
    defaultMax: 1,
    min: 0,
    max: 1,
    step: 0.05,
  },
  {
    label: "Loudness",
    name: "loudness",
    description:
      "The overall loudness of a track in decibels (dB). Loudness values are averaged across the entire track and are useful for comparing relative loudness of tracks. Loudness is the quality of a sound that is the primary psychological correlate of physical strength (amplitude). Values typically range between -60 and 0 db.",
    defaultMin: -60,
    defaultTarget: -30,
    defaultMax: 0,
    min: -60,
    max: 0,
    step: 0.05,
  },
  {
    label: "Mode",
    name: "mode",
    description:
      "Mode indicates the modality (major or minor) of a track, the type of scale from which its melodic content is derived. Major is represented by 1 and minor is 0.",
    defaultMin: 0,
    defaultTarget: 0,
    defaultMax: 1,
    min: 0,
    max: 1,
    step: 1,
  },
  {
    label: "Speechiness",
    name: "speechiness",
    description:
      "Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value. Values above 0.66 describe tracks that are probably made entirely of spoken words. Values between 0.33 and 0.66 describe tracks that may contain both music and speech, either in sections or layered, including such cases as rap music. Values below 0.33 most likely represent music and other non-speech-like tracks.",
    defaultMin: 0,
    defaultTarget: 0.5,
    defaultMax: 1,
    min: 0,
    max: 1,
    step: 0.05,
  },
  {
    label: "Tempo",
    name: "tempo",
    description:
      "The overall estimated tempo of a track in beats per minute (BPM). In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration.",
    defaultMin: 20,
    defaultTarget: 120,
    defaultMax: 200,
    min: 20,
    max: 200,
    step: 1,
  },
  {
    label: "Time signature",
    name: "timeSignature",
    description:
      "An estimated time signature. The time signature (meter) is a notational convention to specify how many beats are in each bar (or measure). The time signature ranges from 3 to 7 indicating time signatures of 3/4, to 7/4.",
    defaultMin: 3,
    defaultTarget: 5,
    defaultMax: 7,
    min: 3,
    max: 7,
    step: null,
    marks: [
      {
        value: 3,
        label: "3/4",
      },
      {
        value: 4,
        label: "4/4",
      },
      {
        value: 5,
        label: "5/4",
      },
      {
        value: 6,
        label: "6/4",
      },
      {
        value: 7,
        label: "7/4",
      },
    ],
  },
  {
    label: "Valence",
    name: "valence",
    description:
      "A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).",
    defaultMin: 0,
    defaultTarget: 0.5,
    defaultMax: 1,
    min: 0,
    max: 1,
    step: 0.05,
  },
  {
    label: "Popularity",
    name: "popularity",
    description:
      "The popularity of a track is a value between 0 and 100, with 100 being the most popular. The popularity is calculated by algorithm and is based, in the most part, on the total number of plays the track has had and how recent those plays are. Generally speaking, songs that are being played a lot now will have a higher popularity than songs that were played a lot in the past. Duplicate tracks (e.g. the same track from a single and an album) are rated independently. Artist and album popularity is derived mathematically from track popularity. ",
    defaultMin: 0,
    defaultTarget: 50,
    defaultMax: 100,
    min: 0,
    max: 100,
    step: 1,
  },
];
