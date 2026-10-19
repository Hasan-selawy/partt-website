import { site } from './site';
import { MOTION_STORAGE_KEY } from '@/lib/motion/boot';

export type PolicySection = {
  id: string;
  title: string;
  paragraphs: string[];
  items?: string[];
  links?: { label: string; href: string }[];
};

export type Policy = {
  title: string;
  lines: string[];
  path: string;
  description: string;
  introduction: string;
  sections: PolicySection[];
};

export const policyUpdated = { date: '2026-10-18', label: '18 October 2026' };

/** Website policies. Review these whenever contact delivery, hosting, or tracking changes. */
export const policies: Record<'privacy' | 'cookies' | 'terms', Policy> = {
  privacy: {
    title: 'Privacy Policy',
    lines: ['Privacy', 'policy.'],
    path: '/privacy-policy',
    description: 'How partt handles website inquiries, personal information, and your privacy choices.',
    introduction: 'A clear explanation of the information you share with us and how it is used.',
    sections: [
      {
        id: 'privacy-about',
        title: 'Who we are',
        paragraphs: [
          `${site.legalName} is a strategic marketing agency based in ${site.location}. This policy covers website inquiries, job applications, and the personal information handled through our website. Our contact address for inquiries and privacy requests is ${site.email}.`,
          'A client project may involve additional information and separate contractual arrangements. Where that happens, the relevant agreement and any additional privacy information also apply.',
        ],
      },
      {
        id: 'privacy-information',
        title: 'Information you share',
        paragraphs: [
          'When you use the project inquiry form, we ask for your name, email address, and a description of your project. You can also choose to provide your company or brand, phone number, the service you need, and an approximate budget.',
          'If you contact us by email or phone, we receive the information you include in that conversation. Please share only what is relevant to your inquiry, and avoid sending passwords, payment-card details, or sensitive personal information through the form.',
          'The form displays whether delivery succeeds. If delivery fails or the form is unavailable, please contact us directly rather than assuming your message reached our team.',
        ],
      },
      {
        id: 'privacy-recruitment',
        title: 'Job applications',
        paragraphs: [
          'When you apply for an open role, we collect your name, email address, PDF CV, and the role you selected. You may also provide your phone number, a portfolio or LinkedIn URL, and a message. Please leave out sensitive details that are not needed to assess your application.',
          'With the consent you give on the application form, we use those details to assess your suitability for the role and contact you about recruitment. We record when you agreed and the version of this notice. Submitting an application does not create an employment relationship or guarantee an interview or offer.',
          'Applications and CVs are stored in a private recruitment database and file store. Access is limited to authorized Partt staff and the service providers needed to operate recruitment. Our team may record interview or review notes and an application status. Applicant details and CVs are not displayed publicly.',
          `To correct or withdraw an application, or ask us to delete it, contact ${site.email}. We do not treat an application as permission to send marketing messages or keep it for unrelated future roles.`,
        ],
      },
      {
        id: 'privacy-use',
        title: 'How information is used',
        paragraphs: [
          'We use inquiry information to read and respond to your message, understand your project, prepare a requested proposal, and communicate about services you ask us to provide.',
          'Submitting a project inquiry does not subscribe you to a newsletter. If we want to use your information for a separate purpose that needs your permission, we will request that permission separately.',
        ],
      },
      {
        id: 'privacy-website',
        title: 'Website data & storage',
        paragraphs: [
          'Our website does not currently use analytics tools or advertising pixels. Visitors do not need an account to browse or apply. The recruitment dashboard has staff accounts and an essential sign-in cookie; job applications and CVs are stored privately. Project inquiry submissions are not stored in the website database.',
          'If you choose to turn animations on despite a reduced-motion device setting, your browser remembers that choice in local storage. That preference is read on your device and is not sent with a project inquiry. Our Cookie Policy explains how to clear it.',
          'Delivering the website involves technical connection information, such as an IP address, browser information, the requested page, and the time of a request. Website and email providers may process that information to deliver their services and maintain security.',
        ],
      },
      {
        id: 'privacy-sharing',
        title: 'Service providers',
        paragraphs: [
          'Website hosting, storage, email, and message-delivery providers may process the information needed to operate the site, store applications, and deliver inquiries. Details are shared with the people at partt who need them to respond to your request or review your application.',
          'We do not sell contact-form submissions or publish them. Information may be disclosed when required by applicable law or a lawful request from a competent authority.',
          'A provider may process information outside Jordan. Any transfer must meet the requirements that apply to that transfer. You can contact us for details about the providers and processing locations relevant to your inquiry.',
        ],
      },
      {
        id: 'privacy-retention',
        title: 'Retention & security',
        paragraphs: [
          'We retain inquiry correspondence while it is needed to handle your request and any resulting working relationship, or for a period required by applicable law. We delete or anonymize information when it is no longer needed.',
          'We retain recruitment records while the relevant hiring process and any necessary follow-up are active, then delete or anonymize them when no longer needed, subject to applicable legal requirements. Closing a job listing stops new applications; it does not automatically delete existing applications. Contact us for the retention period applicable to your application.',
          'We limit access to inquiry information to the people and providers who need it for those purposes. No website or email service can promise absolute security; please use an agreed secure channel for confidential project materials.',
        ],
      },
      {
        id: 'privacy-rights',
        title: 'Your privacy choices',
        paragraphs: [
          'Subject to applicable law, you can request access to your personal information, a correction, deletion or anonymization, a restriction on processing, or a transferable copy. You can also object to qualifying processing and withdraw consent where processing relies on it.',
          `Send your request to ${site.email}. We may need enough information to confirm your identity and locate the relevant correspondence. If a legal requirement affects what we can do, we will explain it.`,
          'You may also raise a complaint with the Personal Data Protection Directorate at Jordan’s Ministry of Digital Economy and Entrepreneurship.',
        ],
        links: [{ label: 'Jordan’s personal data protection authority', href: 'https://www.modee.gov.jo/EN/Pages/Personal_Data_Protection_Unit' }],
      },
      {
        id: 'privacy-updates',
        title: 'Changes to this policy',
        paragraphs: [
          'We may update this policy when the website or our data-handling practices change. The date at the top identifies the latest version. A change to this notice does not itself provide consent for a new use of your information.',
        ],
      },
    ],
  },
  cookies: {
    title: 'Cookie Policy',
    lines: ['Cookie', 'policy.'],
    path: '/cookie-policy',
    description: 'The cookies and browser storage used by the partt website, and how to manage your preferences.',
    introduction: 'What this website remembers in your browser, why it matters, and how you stay in control.',
    sections: [
      {
        id: 'cookies-explained',
        title: 'Cookies & local storage',
        paragraphs: [
          'Cookies are small values stored by a browser that can be sent back to a website with later requests. Local storage also saves information in your browser, but it is not automatically sent to the server with each request.',
          'This policy describes the storage used by the partt website. A separate website you visit through a link has its own policies.',
        ],
      },
      {
        id: 'cookies-current',
        title: 'What we currently use',
        paragraphs: [
          'The public website uses a local-storage preference to remember an animation choice. The private HR dashboard also uses an essential sign-in cookie for authorized staff. We do not currently set analytics or advertising cookies or run advertising pixels.',
          'You can browse the website without accepting advertising or analytics tracking because those tools are not currently used here.',
        ],
      },
      {
        id: 'cookies-motion',
        title: 'Your motion preference',
        paragraphs: [
          `Name: ${MOTION_STORAGE_KEY}. Storage type: local storage. Purpose: remember when you select “Turn motion on” after your device has requested reduced motion.`,
          'This preference contains the value “on”. It does not contain your name, email, or a visitor identifier, and the website does not send it to partt. It remains in that browser until its site data is cleared or the browser removes it.',
          'If you have not made that choice, the site follows your device’s motion preference without saving an override.',
        ],
      },
      {
        id: 'cookies-hr',
        title: 'Staff sign-in',
        paragraphs: [
          'Name: payload-token. Storage type: first-party cookie. Purpose: authenticate authorized Partt staff in the private HR dashboard and protect access to job applications and CVs. It is not required to browse Careers or submit an application.',
          'The staff token has an eight-hour lifetime, may be renewed during an active session, and is cleared on sign-out. It is marked HttpOnly so website scripts cannot read it, uses SameSite=Lax, and is sent over HTTPS in production. Signing out ends the corresponding server session.',
          'The HR interface may also save staff-only display choices, such as its theme, in browser storage. These choices support the dashboard and are not advertising or cross-site tracking.',
        ],
      },
      {
        id: 'cookies-controls',
        title: 'Managing your choice',
        paragraphs: [
          'Use your browser’s site-data controls to remove the saved motion preference. Clearing data for this website resets the override, so the website will follow your device’s reduced-motion setting again.',
          'You can also restrict cookies and browser storage in your browser settings. Cookie controls and local-storage controls may be separate. The website remains readable when storage is unavailable, although it may not remember your animation choice on a later visit.',
        ],
      },
      {
        id: 'cookies-other-sites',
        title: 'Other websites & tools',
        paragraphs: [
          'The website serves its fonts and project images from the site rather than embedding an external font service. Links to external websites open services with their own storage and privacy practices.',
        ],
      },
      {
        id: 'cookies-updates',
        title: 'Future changes',
        paragraphs: [
          'If we introduce analytics, advertising, or other optional storage, we will update this policy and provide the information and choices required before using those tools. The date at the top shows when this policy was last updated.',
          'For information about project inquiries and your personal information, please read our Privacy Policy or contact us using the details below.',
        ],
      },
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    lines: ['Terms &', 'conditions.'],
    path: '/terms-and-conditions',
    description: 'Terms for using the partt website, viewing our work, and sending a project inquiry.',
    introduction: 'Simple terms for exploring our website, viewing our work, and starting a conversation.',
    sections: [
      {
        id: 'terms-website',
        title: 'About this website',
        paragraphs: [
          `${site.legalName} operates this website to introduce our services and show selected work. These terms relate to use of the website. Please use it lawfully and respect the rights described below.`,
          'You can browse without creating an account or making a purchase. A project inquiry starts a conversation; it does not by itself create a service agreement or commit either party to a project.',
        ],
      },
      {
        id: 'terms-use',
        title: 'Responsible use',
        paragraphs: ['When using the website, please do not:'],
        items: [
          'Try to access private systems, accounts, or information without permission.',
          'Introduce malicious code, disrupt the website, or use the inquiry form for spam or deceptive messages.',
          'Submit material you have no right to share, or use the website to infringe another person’s rights.',
        ],
      },
      {
        id: 'terms-content',
        title: 'Our work & other rights',
        paragraphs: [
          'The website includes branding, writing, designs, photographs, and project materials belonging to partt, our clients, or other rights holders. Client names and trademarks remain the property of their respective owners.',
          'Viewing a case study does not transfer ownership or grant a commercial license. Please obtain the relevant permission before reproducing or using protected materials, except where applicable law permits that use.',
        ],
      },
      {
        id: 'terms-inquiries',
        title: 'Inquiries & proposals',
        paragraphs: [
          'Please provide accurate contact details and information you are authorized to share. Send only an initial project outline through the website; agree an appropriate channel with us before sharing confidential files or sensitive information.',
          'Service scope, deliverables, fees, payment terms, timelines, confidentiality, and ownership or licensing of project work are agreed separately in writing. Website descriptions and portfolio examples do not replace that agreement.',
          'If a signed project agreement addresses the same matter, its project-specific provisions apply to that engagement.',
        ],
      },
      {
        id: 'terms-careers',
        title: 'Careers & applications',
        paragraphs: [
          'Only roles currently marked open are listed on Careers. Openings may change or close during recruitment. Applying does not guarantee an interview, offer, or employment agreement.',
          'Provide accurate information and upload only a PDF CV you are entitled to share. Do not include malicious files or information about other people without permission. Our Privacy Policy explains how we handle your application. Contact us by email if you need to correct or withdraw it.',
        ],
      },
      {
        id: 'terms-information',
        title: 'Information & availability',
        paragraphs: [
          'We aim to keep website information accurate and useful, but content and service descriptions may change. Past work and results illustrate particular projects; they are not a promise of the same outcome for another project.',
          'Website access may be interrupted for maintenance or technical reasons. Please confirm any information material to a project directly with our team before relying on it for a business decision.',
        ],
      },
      {
        id: 'terms-external',
        title: 'External links & privacy',
        paragraphs: [
          'Links to another website are provided for reference. We do not operate those websites, and their own terms and privacy policies apply when you visit them.',
          'Our Privacy Policy explains how website inquiries and personal information are handled. Our Cookie Policy explains the motion preference stored in your browser.',
        ],
      },
      {
        id: 'terms-law',
        title: 'Applicable law',
        paragraphs: [
          'These website terms are governed by the laws of Jordan, subject to any mandatory rights that apply to you. Nothing in these terms excludes a right or responsibility that cannot lawfully be excluded.',
          'If you have a concern about the website, please contact us so we can try to resolve it. Any separate project agreement may contain its own provisions for handling project disputes.',
        ],
      },
      {
        id: 'terms-updates',
        title: 'Updates to these terms',
        paragraphs: [
          'We may update these website terms as the site changes. The date at the top identifies the current version. Changes to website terms do not amend a separately signed project agreement.',
        ],
      },
    ],
  },
};
