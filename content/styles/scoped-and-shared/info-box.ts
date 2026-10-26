import html from './info-box.html';
import css from './info-box.css';
import { Component } from 'nubond';

// own css + the names of adopted styles
@Component(html, css, ['shared'])
export class InfoBox {
    public text = '';
}
