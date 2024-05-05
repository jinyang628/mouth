enum MessageAction {
    PopulateChatlogLinks = 'populateChatlogLinks',
    NavigateToLinks = 'navigateToLinks',
    SendClipboardContent = 'sendClipboardContent',
    UpdateShareGptLinkList = 'updateShareGptLinkList'
}

abstract class Message{
    readonly action: MessageAction;

    constructor(action: MessageAction) {
        this.action = action;
    }
}

interface PopulateChatlogLinksMessageConfig {
    links: string[];
}

export class PopulateChatlogLinksMessage extends Message {
    links: string[];

    constructor(config: PopulateChatlogLinksMessageConfig) {
        super(MessageAction.PopulateChatlogLinks)
        this.links = config.links;
    }

    static validate(message: any): boolean {
        return message !== null &&
               typeof message === 'object' &&
               message.action === MessageAction.PopulateChatlogLinks &&
               Array.isArray(message.links) &&
               message.links.every((link: string) => typeof link === 'string'); 
    }
}

export class NavigateToLinksMessage extends Message{

    constructor() {
        super(MessageAction.NavigateToLinks);
    }

    static validate(message: any): boolean {
        return message !== null &&
               typeof message === 'object' &&
               message.action === MessageAction.NavigateToLinks;
    }
}

interface SendClipboardContentMessageConfig {
    content: string;
}

export class SendClipboardContentMessage extends Message {
    content: string;

    constructor(config: SendClipboardContentMessageConfig) {
        super(MessageAction.SendClipboardContent);
        this.content = config.content;
    }

    static validate(message: any): boolean {
        return message !== null &&
               typeof message === 'object' &&
               message.action === MessageAction.SendClipboardContent &&
               typeof message.content === 'string';
    }
}

interface UpdateShareGptLinkListMessageConfig {
    link: string;
}

export class UpdateShareGptLinkListMessage extends Message {
    link: string;

    constructor(config: UpdateShareGptLinkListMessageConfig) {
        super(MessageAction.UpdateShareGptLinkList);
        this.link = config.link;
    }

    static validate(message: any): boolean {
        return message !== null &&
               typeof message === 'object' &&
               message.action === MessageAction.UpdateShareGptLinkList &&
               typeof message.link === 'string';
    }
}