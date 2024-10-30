import {
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
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DataService } from '../shared/services/data.service';
import { SnackbarService } from '../shared/services/snackbar.service';
import { Router, RouterModule } from '@angular/router';
import { SpinnerService } from '../shared/services/spinner.service';
import { Auth, authState } from '@angular/fire/auth';

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
export class CreatePostComponent implements OnInit {
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
  auth = inject(Auth);
  authState$ = authState(this.auth);
  userId;
  front = false;

  ngOnInit(): void {
    if (navigator.onLine) {
      this.postForm = this.fb.group({
        title: ['', [Validators.required]],
        location: [''],
        image: [''],
      });

      document.getElementById('pick-image').style.display = 'none';

      this.initCamera();
      this.getLocation();
      this.authState$.subscribe((user) => {
        this.userId = user.uid;
      });
    } else {
      this.snackbarService.showSnackbar('You are offline!', null, 3000);
    }
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
      .getUserMedia({ video: { facingMode: 'environment' } })
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

  flipCamera() {
    this.front = !this.front;
    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: this.front ? 'user' : 'environment' },
      })
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

    this.imageData = this.canvas.nativeElement.toDataURL('image/webp');
  }

  onNoClick(): void {
    this.router.navigate(['/posts']);
  }

  createPost() {
    this.spinnerService.showSpinner(true);
    this.dataService.uploadFile(this.imageData).then((result) => {
      this.postForm.controls['image'].setValue(result);
      this.dataService
        .addPostToDatabase(this.postForm.value, this.userId)
        .subscribe({
          next: (response) => {
            this.router.navigate(['/posts']);
            this.snackbarService.showSnackbar('Post Created!', null, 3000);
            this.spinnerService.showSpinner(false);
          },
          error: (err) => {
            this.snackbarService.showSnackbar(err, null, 3000);
          },
        });
    });
  }
}
