export async function getUser(userId) {
    let user = await fetch(`/api/users/${userId}`).then(res => res.json());
    return user[0];
}

export async function getEmailsFrom(userId) {
    return await fetch(`/api/emails/from/${userId}`).then(res => res.json());
}

export async function getEmailsTo(userId) {
    return await fetch(`/api/emails/to/${userId}`).then(res => res.json());
}

