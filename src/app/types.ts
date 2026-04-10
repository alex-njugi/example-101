export type Source = 'audius' | 'jamendo';


export type Track = {
id: string;
source: Source;
title: string;
artist: string;
album?: string;
durationSec: number;
artwork?: string;
audioUrl: string;
licenseUrl?: string;
downloadable?: boolean;
lyrics?: { raw?: string; lrc?: string };
tags?: string[];
};


export type Playlist = {
id: string;
name: string;
trackIds: string[];
createdAt: number;
};