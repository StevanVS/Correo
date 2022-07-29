import * as controllers from './controllers.js';

const container = document.querySelector('[data-emails-table-body]');

async function renderEmailRows(userId) {
    const emails = await controllers.getEmailsTo(userId);
    let html = '';

    for (const email of emails) {
        const { name, lastname } = await controllers.getUser(email.from_user);
        let htmlSegment = `
            <tr>
                <td>${name} ${lastname}</td>
                <td>${email.subject}</td>
                <td><div class="snippet">${email.message}</div></td>
            </tr>
        `;

        html += htmlSegment;
    }

    container.innerHTML = html;
}



fetch('/api/currentuser')
    .then(result => result.json())
    .then(user => {
        console.log(user);
        renderEmailRows(user.id);
    })



const newMailBtn = document.querySelector('[data-new-email-btn]');
const newMailDialog = document.querySelector('[data-new-email-dialog]');
const newMailForm = document.querySelector('[data-new-email-form]');


addEventsCloseDialog(newMailDialog, newMailForm);

newMailBtn.onclick = (e) => {
    newMailDialog.showModal();
}

function addEventsCloseDialog(dialogEl, formEl) {
    dialogEl.addEventListener('click', e => {
        if (e.target.tagName.toLowerCase() === 'dialog') {
            dialogEl.close();
        }
    });

    if (formEl) {
        formEl.querySelector('[data-close-modal]')
            .onclick = () => {
                dialogEl.close();
            }
    }
}

