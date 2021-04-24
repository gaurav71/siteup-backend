interface siteDownEmailFormatInput {
  userName: string;
  website: string;
  downTime: number;
}

export const siteDownEmailFormat = (input: siteDownEmailFormatInput) => {
  const { website, userName, downTime, } = input
  
  return {
    subject: `${website} is down.`,
    body: `Hi ${userName}, ${website} is down. Last checked on ${new Date(downTime).toTimeString()}.`
  }
}