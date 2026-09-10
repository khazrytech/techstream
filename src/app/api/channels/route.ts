import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://iptv-org.github.io/iptv/index.m3u', {
      next: { revalidate: 3600 }
    });
    
    if (!response.ok) {
      throw new Error('Imeshindikana kupata chaneli za IPTV');
    }

    const m3uText = await response.text();
    const lines = m3uText.split('\n');
    
    const channels: Array<{
      id: string;
      name: string;
      logo: string;
      category: string;
      url: string;
    }> = [];

    let currentChannel: any = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('#EXTINF:')) {
        currentChannel = {};
        
        const nameMatch = line.match(/,(.+)$/);
        if (nameMatch) {
          currentChannel.name = nameMatch[1].trim();
        }

        const logoMatch = line.match(/tvg-logo="([^"]+)"/);
        if (logoMatch) {
          currentChannel.logo = logoMatch[1];
        }

        const groupMatch = line.match(/group-title="([^"]+)"/);
        if (groupMatch) {
          currentChannel.category = groupMatch[1].trim();
        } else {
          currentChannel.category = 'General';
        }
      } else if (line && !line.startsWith('#')) {
        currentChannel.url = line;
        if (currentChannel.name && currentChannel.url) {
          channels.push({
            id: Math.random().toString(36).substring(2, 9),
            name: currentChannel.name,
            logo: currentChannel.logo || 'https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=200&auto=format&fit=crop',
            category: currentChannel.category,
            url: currentChannel.url
          });
        }
      }
    }

    const validChannels = channels.filter(c => c.logo && c.url && !c.url.includes('.html'));

    const categoriesMap: { [key: string]: typeof validChannels } = {};
    
    validChannels.forEach(channel => {
      let cat = channel.category;
      if (/sport/i.test(cat)) cat = 'Sports';
      else if (/news/i.test(cat)) cat = 'News';
      else if (/movie|film/i.test(cat)) cat = 'Movies';
      else if (/kids|children|cartoon/i.test(cat)) cat = 'Kids';
      else if (/music/i.test(cat)) cat = 'Music';
      else if (/documentary|history|science/i.test(cat)) cat = 'Documentary';
      else cat = 'General';

      if (!categoriesMap[cat]) {
        categoriesMap[cat] = [];
      }
      if (categoriesMap[cat].length < 30) {
        categoriesMap[cat].push(channel);
      }
    });

    return NextResponse.json({ success: true, categories: categoriesMap });
  } catch (error) {
    console.error('IPTV Fetch Error:', error);
    return NextResponse.json({ success: false, error: 'Imeshindikana kupakia chaneli' }, { status: 500 });
  }
}
