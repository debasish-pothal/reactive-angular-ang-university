import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Course } from '../model/course';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from '../loading/loading.service';
import { MessagesService } from '../messages/messages.service';

@Injectable({
  providedIn: 'root',
})
export class CoursesStore {
  private coursesSubject$ = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.coursesSubject$.asObservable();

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private messagesService: MessagesService
  ) {
    this.loadAllCourses();
  }

  private loadAllCourses() {
    const loadCourses$ = this.http.get<Course[]>('/api/courses').pipe(
      map((res) => res['payload']),
      catchError((err) => {
        const error = 'Could not load courses';
        this.messagesService.showErrors(error);
        return throwError(err);
      }),
      tap((courses) => this.coursesSubject$.next(courses)),
      shareReplay()
    );

    this.loadingService.showLoaderUntilCompleted(loadCourses$).subscribe();
  }

  filterByCategory(category: string) {
    return this.courses$.pipe(
      map((courses) => courses.filter((course) => course.category === category))
    );
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    const courses = this.coursesSubject$.getValue();

    const newCourses = courses.map((course) => {
      if (course.id === courseId) {
        return {
          ...course,
          ...changes,
        };
      }

      return course;
    });

    this.coursesSubject$.next(newCourses);

    return this.http.put(`/api/courses/${courseId}`, changes).pipe(
      catchError((err) => {
        const error = 'Could not save course changes';
        this.messagesService.showErrors(error);
        return throwError(err);
      }),
      shareReplay()
    );
  }
}
