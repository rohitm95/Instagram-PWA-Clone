import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DataService } from '../shared/data.service';
import { SnackbarService } from '../shared/snackbar.service';
import { Router, RouterModule } from '@angular/router';
import { SpinnerService } from '../shared/spinner.service';

@Component({
  selector: 'app-create-post',
  templateUrl: 'create-post.component.html',
  styleUrl: 'create-post.component.scss',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterModule,
  ],
})
export class CreatePostComponent implements OnInit, AfterViewInit {
  @ViewChild('video') video: ElementRef;
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('locationLoader') locationLoader: ElementRef;

  context: CanvasRenderingContext2D;

  postForm: FormGroup;
  fb = inject(FormBuilder);
  dataService = inject(DataService);
  snackbarService = inject(SnackbarService);
  router = inject(Router);
  imageData;
  selectedFile: any = null;
  imageURL;
  spinnerService = inject(SpinnerService);

  ngOnInit(): void {
    if (navigator.onLine) {
      this.postForm = this.fb.group({
        title: [''],
        location: [''],
        image: [''],
      });

      document.getElementById('pick-image').style.display = 'none';

      this.initCamera();
      this.getLocation();
    } else {
      this.snackbarService.showSnackbar('You are offline!', null, 3000);
    }
  }

  ngAfterViewInit(): void {
    // document.getElementById('location-loader').style.display = 'none';
    // if (!('geolocation' in navigator)) {
    //   document.getElementById('location-button').style.display = 'none';
    // }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
    this.imageData = this.selectedFile;
    const reader = new FileReader();

    reader.onload = () => {
      this.imageURL = reader.result;
    };

    reader.readAsDataURL(this.selectedFile);
  }

  initCamera() {
    document.getElementById('canvas').style.display = 'none';
    document.getElementById('player').style.display = 'block';
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        document.getElementById('pick-image').style.display = 'none';
        this.video.nativeElement.srcObject = stream;
      })
      .catch((error) => {
        document.getElementById('pick-image').style.display = 'block';
        document.getElementById('capture-image').style.display = 'none';
        console.error('Error accessing camera:', error);
      });
  }

  getLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // document.getElementById('location-loader').style.display = 'none';
        // document.getElementById('location-button').style.display =
        //   'inline-flex';
        let fetchedLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.postForm.controls['location'].setValue(fetchedLocation);
      },
      (error) => {
        console.log(error);
        // document.getElementById('location-loader').style.display = 'none';
        // document.getElementById('location-button').style.display =
        //   'inline-flex';
        // alert("Couldn't fetch location, please enter manually!");
      },
      { timeout: 7000 }
    );
  }

  reCapture() {
    this.imageData = null;
    this.initCamera();
  }

  captureImage() {
    this.context = this.canvas.nativeElement.getContext('2d');
    this.canvas.nativeElement.width = this.video.nativeElement.videoWidth;
    this.canvas.nativeElement.height = this.video.nativeElement.videoHeight;
    this.context.drawImage(this.video.nativeElement, 0, 0);
    document.getElementById('player').style.display = 'none';
    document.getElementById('canvas').style.display = 'block';
    this.video.nativeElement.srcObject.getVideoTracks().forEach((track) => {
      track.stop();
    });

    this.imageData = this.canvas.nativeElement.toDataURL('image/jpeg');
  }

  onNoClick(): void {
    this.router.navigate(['/posts']);
  }

  createPost() {
    this.spinnerService.showSpinner.next(true);
    this.dataService.uploadFile(this.imageData).then((result) => {
      this.postForm.controls['image'].setValue(result);
      this.dataService.addPostToDatabase(this.postForm.value).subscribe({
        next: (response) => {
          this.router.navigate(['/posts']);
          this.snackbarService.showSnackbar('Post Created!', null, 3000);
          this.spinnerService.showSpinner.next(false);
        },
      });
    });
  }
}
