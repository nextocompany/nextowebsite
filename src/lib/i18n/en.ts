import type { Dictionary } from './types'

export const en: Dictionary = {
  meta: {
    lang: 'en',
    title: 'Nexto | Scattered data, brought together',
    description:
      'Nexto develops software that integrates data from multiple systems and medical devices, enabling clinical teams and healthcare organizations to work more efficiently.',
    ogLocale: 'en_US',
  },
  nav: {
    approach: 'Approach',
    products: 'Products',
    beyond: 'Beyond healthcare',
    contact: 'Contact',
    switchLanguage: 'TH',
    switchLanguageLabel: 'เปลี่ยนเป็นภาษาไทย',
    menu: 'Menu',
  },
  hero: {
    title: 'Scattered data, brought together.',
    subtitle:
      'We develop software that connects data across systems and medical devices, so clinical teams work more efficiently.',
    primaryCta: 'Request a demo',
    secondaryCta: 'Explore our products',
  },
  partners: {
    label: 'In collaboration with',
  },
  approach: {
    title: 'Systems handle the data. People make the decisions.',
    body: 'Every system we build maintains a clear division of responsibility. The system ensures that data is complete, accurate and immediately accessible, while decisions remain with the professionals who use it.',
  },
  howWeWork: {
    title: 'Our working principles',
    items: [
      {
        title: 'Designed around clinical practice',
        body: 'We design our solutions around the actual workflows of Thai clinicians and hospital staff.',
      },
      {
        title: 'Integration with existing infrastructure',
        body: 'Our software integrates with existing medical devices and systems rather than replacing them.',
      },
      {
        title: 'Growth through partnership',
        body: 'We collaborate with medical device companies to deliver our software alongside the equipment hospitals already use.',
      },
    ],
  },
  products: {
    title: 'Our products',
    learnMore: 'Learn more',
    endyra: {
      name: 'Endyra',
      status: 'Available',
      description: 'Endoscopy video and image capture system.',
    },
    anvira: {
      name: 'Anvira',
      status: 'In development',
      description: 'Perioperative anesthesia information system.',
    },
  },
  productPages: {
    endyra: {
      meta: {
        title: 'Endyra | Endoscopy Video and Image Capture System',
        description:
          'Endyra captures Full HD endoscopy images with a foot switch, records and times colonoscopy withdrawal, and organizes every case with PDF reports. Runs without an internet connection.',
      },
      status: 'Available',
      headline: 'Every endoscopy, documented.',
      intro:
        'Endyra is an image capture and documentation system for endoscopy units. It captures still images on demand, records the colonoscopy withdrawal and keeps every case organized for review and reporting.',
      note: 'In use in Thailand.',
      cta: { label: 'Request a demo', subject: 'Request a demo: Endyra' },
      blocks: [
        {
          kind: 'cards',
          title: 'Features',
          items: [
            {
              title: 'Full HD image capture',
              body: 'Captures still images in Full HD (1080p) from the endoscopy video signal, through capture cards that accept up to 4K at 60 frames per second.',
            },
            {
              title: 'Foot switch capture',
              body: 'Captures a still image with a single press of the foot switch, linked to the case automatically.',
            },
            {
              title: 'Organized cases',
              body: 'Every recording is linked to the patient, the physician and the date, and any case can be found in under a second.',
            },
            {
              title: 'Withdrawal recording and timing',
              body: 'Records video and times the withdrawal phase of each colonoscopy.',
            },
            {
              title: 'PDF reports',
              body: 'Physicians review each case and produce a PDF report from the clinician portal.',
            },
            {
              title: 'No internet required',
              body: 'Runs entirely on the hospital network, without an internet connection.',
            },
          ],
        },
        {
          kind: 'steps',
          title: 'How it works',
          items: [
            {
              title: 'Capture',
              body: 'Open the case at the kiosk in the endoscopy room. Still images and the withdrawal video are linked to the case as the procedure runs.',
            },
            { title: 'Organize', body: 'Each case is indexed by patient, physician and date, ready to search.' },
            { title: 'Report', body: 'Review the case in the clinician portal and produce its PDF report.' },
          ],
        },
        {
          kind: 'list',
          title: 'Installation and support',
          items: [
            'Installed and ready within one day.',
            'Works on isolated hospital networks.',
            'Support available every day.',
          ],
        },
      ],
      contactTitle: 'See Endyra in your endoscopy unit',
    },
    anvira: {
      meta: {
        title: 'Anvira | Perioperative Anesthesia Information System',
        description:
          'Anvira brings patient history from the HIS into the pre-anesthetic assessment and records anesthesia electronically from monitors and anesthesia machines. In development; pilot hospitals welcome.',
      },
      status: 'In development',
      headline: 'The anesthesia record, complete without paper.',
      intro:
        'Anvira supports anesthesiologists before, during and after surgery: patient history at hand for the assessment, vital signs recorded from the devices, and a finished record ready for the HIS.',
      cta: { label: 'Join as a pilot hospital', subject: 'Pilot hospital: Anvira' },
      blocks: [
        {
          kind: 'cards',
          title: 'Scope',
          items: [
            {
              label: 'Before surgery',
              title: 'Pre-anesthetic assessment',
              body: "Patient history is retrieved from the HIS and presented for the anesthesiologist's review.",
            },
            {
              label: 'During surgery',
              title: 'Electronic anesthesia record',
              body: 'Vital signs are recorded automatically from patient monitors and the anesthesia machine, alongside a timeline of drugs, fluids and key events.',
            },
            {
              label: 'After surgery',
              title: 'Record for the HIS',
              body: 'The completed anesthesia record is exported for the anesthesiologist to submit to the HIS.',
            },
          ],
        },
        {
          kind: 'callout',
          title: 'No gaps in the record',
          body: 'If the connection to a device is lost, Anvira switches to manual entry so the anesthesiologist can continue recording. Automatic recording resumes as soon as the connection returns.',
        },
        {
          kind: 'list',
          title: 'Integration',
          items: ["Connects with the hospital's HIS to the extent its interfaces allow."],
        },
        {
          kind: 'callout',
          title: 'Pilot hospitals',
          body: 'We are working with anesthesia departments to shape Anvira around real practice. If your department would like to take part, please contact us.',
        },
      ],
      contactTitle: 'Take part in the pilot',
    },
  },
  beyond: {
    title: 'Beyond healthcare',
    saaniq: {
      name: 'Saaniq',
      description: 'An integrated hotel and resort management platform covering PMS, CRM, HR and finance.',
      linkLabel: 'Visit saaniq.com',
    },
    engineering: {
      title: 'Engineering partnerships',
      body: 'We co-develop government information systems with our engineering partners.',
    },
  },
  contact: {
    title: 'Contact us',
    intro: 'Select a topic to contact our team by email.',
    topics: [
      { label: 'Request a demo', subject: 'Request a demo' },
      { label: 'Product inquiries', subject: 'Nexto product inquiry' },
      { label: 'Engineering services', subject: 'Engineering services' },
    ],
    emailLabel: 'Email',
    lineLabel: 'LINE',
  },
  closing: 'Connecting data for better care.',
  footer: {
    social: 'Nexto on social media',
    socialLinkPrefix: 'Nexto on',
    rights: '© Nexto Co., Ltd. · Bangkok',
    privacy: 'Privacy',
  },
}
