import axios from "axios";
import Logger from "./logger";
import * as vscode from 'vscode';
import * as xmldom from 'xmldom';
/** this interface will contain icons for both dark and light mode */
interface LoadedIcon {
    lightMode: string;
    darkMode: string;
}

/** will fetch the outline icon of any ionicon and return the svg text */
export const iconLoader = (iconName: string = 'add-circle', readable = true): Promise<LoadedIcon> => {

    let iconToFetchName: string = iconName;

    const iconsVersion = vscode.workspace.getConfiguration('ionicons').get<string>('iconsVersion') ?? '5.4.0';

    if (readable) {
        // For logos there is no outline variant
        //
        if ( iconName.startsWith('logo-') ) {
            iconToFetchName = iconName
        } else if ( iconName.includes('outline')) {
            iconToFetchName = iconName;
        } else if ( iconName.includes('sharp')) {
            Logger.appendLine(`iconName=${iconName} is not an outline one but a sharp one, fetching the outline one for maximum readability`, 'iconLoader', false);
            iconToFetchName = iconName.replace('sharp', 'outline');
        } else {
            Logger.appendLine(`iconName=${iconName} is not an outline one, fetching the outline one for maximum readability`, 'iconLoader', false);
            iconToFetchName = iconName + '-outline';
        }
    }

    const url = `https://unpkg.com/ionicons@${iconsVersion}/dist/svg/${iconToFetchName}.svg`;

    console.log(url);

    return axios.get(url).then( data => {        
        const lightModeIcon = data.data;

        const document = new xmldom.DOMParser().parseFromString(lightModeIcon);
        
        const darkModeIconColor = vscode.workspace.getConfiguration('ionicons').get<string>('darkModeIconColor');

        // Some icons are only colored by changing the fill attribute
        //
        document.documentElement.setAttribute('color', darkModeIconColor ?? 'white');
        // Some icons are only colored by changing the fill attribute
        //
        document.documentElement.setAttribute('fill', darkModeIconColor ?? 'white');

        var darkModeIcon = new xmldom.XMLSerializer().serializeToString(document);

        return {
            darkMode: darkModeIcon,
            lightMode: lightModeIcon
        }
    });
}

/** this will download all available icons for future use. */
export const iconsDownload = () => {
    // TODO see if its possible to predownload all the icons
}
