import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public lat = 40.678178;
  public lng = -73.944158;
  public zoom = 12;

  constructor() { }

  ngOnInit() { }

  subscribe() { }

}
