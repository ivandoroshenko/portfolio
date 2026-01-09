const WORKS_API = './projects.json';

const fetchWorks = async () => {
  try {
    const response = await fetch(WORKS_API);
    if (!response.ok) {
      throw new Error('Failed to fetch works data');
    }
    const data = await response.json();
    console.log('Works data fetched:', data);
    return data.projects;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const renderWorks = (works) => {
  if (!works.length) return;
  const worksSection = document.getElementById('works');
  const worksListElement = document.createElement('ul');
  const worksTitleElement = document.createElement('h2');
  worksTitleElement.className = 'works__title';
  worksTitleElement.textContent = 'My Portfolio';
  worksSection.appendChild(worksTitleElement);
  worksListElement.className = 'works__list';

  worksListElement.innerHTML =
   works.map(work => `
    <li class="works__item">
      <img src="${work.image}" alt="${work.title}" class="works__img">
      <div class="works__desc-wrap">
        <h3 class="works__desc-title">${work.title}</h3>
        <p class="works__desc-text">${work.description}</p>
        </p>
      </div>
      <div class="works__btn-wrapper">
        <a href="${work.demo}" class="works__link" target="_blank">
          View Live Demo
        </a>
      </div>
    </li>
  `).join('');
  worksSection.appendChild(worksListElement);
};

document.addEventListener('DOMContentLoaded', async () => {
  const works = await fetchWorks();
  renderWorks(works);
});