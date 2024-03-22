export const isSameSenderMargin = (messages, m, i, userId) => {
    if (
        messages &&
        messages[i + 1] &&
        messages[i] &&
        m.sender &&
        messages[i + 1].sender
    ) {
        if (
            i < messages.length - 1 &&
            messages[i + 1].sender._id === m.sender._id &&
            messages[i].sender._id !== userId
        ) {
            return 33;
        } else if (
            (i < messages.length - 1 &&
                messages[i + 1].sender._id !== m.sender._id &&
                messages[i].sender._id !== userId) ||
            (i === messages.length - 1 && messages[i].sender._id !== userId)
        ) {
            return 0;
        } else {
            return "auto";
        }
    }
    return "auto";
};

export const isSameSender = (messages, m, i, userId) => {
    console.log(messages);
    if (
        messages &&
        messages[i + 1] &&
        messages[i] &&
        m.sender &&
        messages[i + 1].sender
    ) {
        return (
            i < messages.length - 1 &&
            (messages[i + 1].sender._id !== m.sender._id ||
                messages[i + 1].sender._id === undefined) &&
            messages[i].sender._id !== userId
        );
    }
    return false;
};

export const isLastMessage = (messages, i, userId) => {
    if (messages && messages.length > 0 && messages[i] && messages[i].sender) {
        return (
            i === messages.length - 1 &&
            messages[messages.length - 1].sender._id !== userId &&
            messages[messages.length - 1].sender._id
        );
    }
    return false;
};

export const isSameUser = (messages, m, i) => {
    if (i > 0 && messages && messages[i - 1] && messages[i - 1].sender) {
        return messages[i - 1].sender._id === m.sender._id;
    }
    return false;
};

export const getSender = (loggedUser, users) => {
    return users && users.length === 2
        ? users[0]?._id === loggedUser?._id
            ? users[1].name
            : users[0].name
        : "";
};

export const getSenderFull = (loggedUser, users) => {
    return users && users.length === 2
        ? users[0]._id === loggedUser._id
            ? users[1]
            : users[0]
        : null;
};
