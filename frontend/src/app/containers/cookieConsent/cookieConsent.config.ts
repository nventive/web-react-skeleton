import ICookieSection from "@containers/cookieConsent/interfaces/ICookieSection";

const cookieConsentConfig: Array<ICookieSection> = [
  {
    id: "necessary",
    title: "cookie_modal__necessary_title",
    description: ["cookie_modal__necessary_description"],
    cookies: [
      {
        name: "i18nextLng",
        description:
          "Stores the language preference of the user for localization purposes.",
        duration: "1 year",
      },
      {
        name: "hideBannerUntil",
        description:
          "Keeps track of when the user last dismissed the banner to avoid showing it repeatedly.",
        duration: "4 hours",
      },
      {
        name: "REFRESH_TOKEN",
        description:
          "Used to refresh the authentication token for continued user sessions without re-login.",
        duration: "14 days",
      },
      {
        name: "ACCESS_TOKEN",
        description:
          "Used for authenticating API requests and securing user sessions.",
        duration: "1 hour",
      },
      {
        name: "COOKIE_PREFERENCES",
        description:
          "Stores user's cookie consent preferences. This cookie helps in remembering your choices regarding different types of cookies and ensures that the cookie consent banner is not displayed repeatedly based on the saved preferences.",
        duration: "1 year",
      },
    ],
    required: true,
  },
  {
    id: "analytics",
    title: "cookie_modal__analytics_title",
    description: [
      "cookie_modal__analytics_description_1",
      "cookie_modal__analytics_description_2",
    ],
  },
  {
    id: "marketing",
    title: "cookie_modal__marketing_title",
    description: ["cookie_modal__marketing_description"],
    cookies: [
      {
        name: "facebook_pixel",
        description:
          "Enables tracking of user actions on the website for targeted advertising and measurement of the effectiveness of Facebook ads.",
        duration: "90 days",
      },
      {
        name: "hubspotutk",
        description:
          "Keeps track of a visitor's identity and is used to track their interactions with the website. This helps in personalizing the user's experience and improving engagement.",
        duration: "13 months",
      },
      {
        name: "doubleclick",
        description:
          "Used to manage ad campaigns and track ad performance, facilitating targeted advertising based on user behavior.",
        duration: "2 years",
      },
      {
        name: "adroll",
        description:
          "Used to identify users and show them personalized ads across the web, as well as to measure the effectiveness of ad campaigns.",
        duration: "1 year",
      },
      {
        name: "criteo",
        description:
          "Enables personalized retargeting by serving relevant ads to users based on their previous browsing behavior on the website.",
        duration: "6 months",
      },
      {
        name: "linkedin_insight",
        description:
          "Tracks user interactions with the website via LinkedIn, including conversions, and provides data to optimize LinkedIn ad campaigns.",
        duration: "6 months",
      },
      {
        name: "pinterest_tag",
        description:
          "Helps track the conversion of Pinterest ads, allowing for the analysis and optimization of ad performance and user targeting.",
        duration: "1 year",
      },
    ],
  },
];

export default cookieConsentConfig;
