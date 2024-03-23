import { HttpClient, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private baseUrl = 'http://localhost:8080';
  @ViewChild("currentImage", { static: false })
  currentImage!: ElementRef;

  progress = 0;
  message = {
    contentType: '',
    originalFilename: '',
    size: 0,
  };

  constructor(private http: HttpClient) { }

  uploadImage() {
    console.log('nativeElement', this.currentImage?.nativeElement);
    let image: File = this.currentImage?.nativeElement.files[0];
    console.log('image', image);
    const formData: FormData = new FormData();
    formData.append('image', image);
    const req = new HttpRequest('POST', `${this.baseUrl}`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    this.http.request(req).subscribe({
      next: (event: any) => {
        console.log('event', event);
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round((100 * event.loaded) / event.total);
        } else if (event instanceof HttpResponse) {
          this.message = event.body;
        }
      },
      error: (err: any) => {
        console.log(err);
        this.progress = 0;
      },
      complete: () => {
      }
    });
    return false;
  }
}
