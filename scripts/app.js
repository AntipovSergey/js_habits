'use strict';

let habits = [];
const HABIT_KEY = 'HABBIT_KEY';

/* Page */

const page = {
	menu: document.querySelector('.menu__list'),
	header: {
		h1: document.querySelector('.h1'),
		progressPercent: document.querySelector('.progress__percent'),
		progressCoverBar: document.querySelector('.progress__cover-bar'),
	},
	content: {
		daysContainer: document.getElementById('days'),
		nextDay: document.querySelector('.habit__day'),
	},
};

/* Utils */

function loadData() {
	const habitsString = localStorage.getItem('HABIT_KEY');
	const habitArray = JSON.parse(habitsString);
	if (Array.isArray(habitArray)) {
		habits = habitArray;
	}
}

function saveData() {
	localStorage.setItem(HABIT_KEY, JSON.stringify(habits));
}

function rerenderMenu(activeHabit) {
	for (const habit of habits) {
		const existed = document.querySelector(`[menu-habit-id='${habit.id}']`);
		if (!existed) {
			const element = document.createElement('button');
			element.setAttribute('menu-habit-id', habit.id);
			element.classList.add('menu__item');
			element.addEventListener('click', () => rerender(habit.id));
			element.innerHTML = `
			<img src="./images/${habit.icon}.svg" alt="${habit.name} logo" />
			`;
			if (activeHabit.id === habit.id) {
				element.classList.add('menu__item--active');
			}
			page.menu.appendChild(element);
			continue;
		}
		if (activeHabit.id === habit.id) {
			existed.classList.add('menu__item--active');
		} else {
			existed.classList.remove('menu__item--active');
		}
	}
}

function rerenderHead(activeHabit) {
	page.header.h1.innerText = activeHabit.name;
	const progress =
		activeHabit.days.length / activeHabit.target > 1
			? 100
			: (activeHabit.days.length / activeHabit.target) * 100;
	page.header.progressPercent.innerText = `${progress.toFixed(0)}%`;
	page.header.progressCoverBar.style.width = `${progress.toFixed(0)}%`;
}

function rerenderContent(activeHabit) {
	page.content.daysContainer.innerHTML = '';
	const { days } = activeHabit;

	for (const day in days) {
		const element = document.createElement('div');
		element.classList.add('habit');
		element.innerHTML = `
			<div class="habit__day">День ${Number(day) + 1}</div>
							<div class="habit__comment">
								${days[day].comment}
							</div>
							<button class="habit__delete">
								<img src="./images/delete.svg" alt="Delete" />
							</button>
		`;
		page.content.daysContainer.appendChild(element);
	}
	page.content.nextDay.innerText = `День ${days.length + 1}`;
}

function rerender(activeHabitId) {
	const activeHabit = habits.find(habit => habit.id === activeHabitId);
	if (!activeHabit) {
		return;
	}
	rerenderMenu(activeHabit);
	rerenderHead(activeHabit);
	rerenderContent(activeHabit);
}

/* Init */

(() => {
	loadData();
	rerender(habits[0].id);
})();
