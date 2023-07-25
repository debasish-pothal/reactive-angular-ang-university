import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Course } from '../model/course';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { Lesson } from '../model/lesson';
import { LoadingService } from '../loading/loading.service';
import { MessagesService } from '../messages/messages.service';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private messagesService: MessagesService
  ) {}

  loadAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>('/api/courses').pipe(
      map((res) => res['payload']),
      shareReplay()
    );
  }

  loadCourseById(courseId: number): Observable<Course> {
    return this.http
      .get<Course>(`/api/courses/${courseId}`)
      .pipe(shareReplay());
  }

  loadAllCourseLessions(courseId: number): Observable<Lesson[]> {
    return this.http
      .get<Lesson[]>('/api/lessons', {
        params: {
          courseId: courseId.toString(),
          pageSize: '1000',
        },
      })
      .pipe(
        catchError((err) => {
          const message = 'Could not load lessions';
          this.messagesService.showErrors(message);
          return throwError(err);
        }),
        map((res) => res['payload']),
        shareReplay()
      );
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    return this.http
      .put(`/api/courses/${courseId}`, changes)
      .pipe(shareReplay());
  }

  searchLessions(search: string): Observable<Lesson[]> {
    return this.http
      .get<Lesson[]>('/api/lessons', {
        params: {
          filter: search,
          pageSize: '100',
        },
      })
      .pipe(
        catchError((err) => {
          const message = 'Could not load lessions';
          this.messagesService.showErrors(message);
          return throwError(err);
        }),
        map((res) => res['payload']),
        shareReplay()
      );
  }
}
