import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
// import { environment } from '../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() service: string;
  isEnumerationFlow = false;

  constructor(
    private router: Router,
    private titleService: Title,
    private metaService: Meta
  ) {}

  ngOnInit() {
    // Set title and meta description for SEO purposes.
    let title = 'HMS';
    let description = '';

    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });
  }

  goToHome() {
    this.router.navigate(['/home/appointment']);
  }
}
