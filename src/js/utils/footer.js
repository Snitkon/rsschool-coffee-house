import twitter from '/icons/icon-twitter.svg?raw';
import instagram from '/icons/icon-instagram.svg?raw';
import facebook from '/icons/icon-facebook.svg?raw';
import pin from '/icons/icon-pin.svg?raw';
import phone from '/icons/icon-phone.svg?raw';
import clock from '/icons/icon-clock.svg?raw';

export function footer() {
  const selectors = {
    footer: '.footer'
  };

  const footer = document.querySelector(selectors.footer);

  if (!footer) {
    console.warn('Footer is not found, Check selectors: ', selectors);
  }

  const leftBlock = document.createElement('div');
  const rightBlock = document.createElement('div');
  const subtitleFooter = document.createElement('h2');
  const linkBlock = document.createElement('div');
  const twitterBtn = document.createElement('button');
  const instagramBtn = document.createElement('button');
  const facebookBtn = document.createElement('button');
  const contactText = document.createElement('h3');
  const time = document.createElement('time');
  const ulList = document.createElement('ul');
  const liLocal = document.createElement('li');
  const liPhone = document.createElement('li');
  const liTime = document.createElement('li');
  const aLocal = document.createElement('a');
  const aPhone = document.createElement('a');
  const aTime = document.createElement('a');

  leftBlock.classList.add('footer__left_block');
  rightBlock.classList.add('footer__right_block');
  subtitleFooter.classList.add('subtitle', 'footer__subtitle');
  linkBlock.classList.add('footer__link_block');
  twitterBtn.classList.add('footer__twitter_btn', 'button_secondary');
  instagramBtn.classList.add('footer__instagram_btn', 'button_secondary');
  facebookBtn.classList.add('footer__facebook_btn', 'button_secondary');
  contactText.classList.add('footer__contact_text');
  ulList.classList.add('list', 'footer__list');
  aLocal.classList.add('link', 'footer__link');
  aPhone.classList.add('link', 'footer__link');
  aTime.classList.add('link', 'footer__link');
  liLocal.classList.add('footer__list_item');
  liPhone.classList.add('footer__list_item');
  liTime.classList.add('footer__list_item');

  aPhone.setAttribute('href', 'tel:+16035550123');
  aLocal.setAttribute('href', 'https://goo.gl/maps/xyz');
  aLocal.setAttribute('target', '_blank');
  aLocal.setAttribute('rel', 'noopener noreferrer');

  footer.append(leftBlock, rightBlock);
  leftBlock.append(subtitleFooter, linkBlock);
  linkBlock.append(twitterBtn, instagramBtn, facebookBtn);
  rightBlock.append(contactText, ulList);
  ulList.append(liLocal, liPhone, liTime);
  liLocal.append(aLocal);
  liPhone.append(aPhone);
  liTime.append(aTime);

  subtitleFooter.innerHTML = 'Sip, Savor, Smile. <span class="accent">It’s coffee time!</span >';
  twitterBtn.innerHTML = twitter;
  instagramBtn.innerHTML = instagram;
  facebookBtn.innerHTML = facebook;
  contactText.textContent = 'Contact us';
  aLocal.innerHTML = `${pin} 8558 Green Rd.,  LA`;
  aPhone.innerHTML = `${phone} +1 (603) 555-0123`;
  aTime.innerHTML = `${clock} <time datetime="Mo-Sa 09:00-23:00">Mon-Sat: 9:00 AM – 23:00 PM</time>`;
}
