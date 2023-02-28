import { useState, useEffect, useMemo, useRef, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import { classnames } from "../../Utilities";
import { Assessment, Course, Courses } from "../../logic/icsGen";

import { Button, IconButton } from "../../components/Button";

import AppTopBar, {
  LeadingNavigation,
  TrailingIcon,
  Title,
  Subtitle,
} from "../../components/AppTopBar";
import CoursePanel from "./CoursePanel";

import testState from "./data";
import NavigationPanel from "./NavigationPanel";

const Review = () => {
  const [state, setState] = useState<Courses>(testState);
  const stateRef = useRef(state);

  const { courseKey: courseKeyUrlParam } = useParams();
  const [courses, setCourses] = useState<Courses>(testState);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const coursesRef = useRef(courses);

  const deleteOne = () => {
    setState(stateRef.current.filter((course, index) => index !== 0));
    stateRef.current = stateRef.current.filter((course, index) => index !== 0);
  };

  const onCoursesChanged = (word: Course) => {
    const newState = [...stateRef.current, word];
    setState(newState);
    stateRef.current = newState;
  };

  // For NavigationDrawer adapting in smaller desktop screens
  const navRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const [mainMarginLeft, setMainMarginLeft] = useState(-1);
  useLayoutEffect(() => {
    const onMainMarginLeft = () => {
      if (navRef.current && mainRef.current) {
        const marginLeft = mainRef.current.offsetLeft || 0;
        const navWidth = navRef.current?.offsetWidth || 0;
        setMainMarginLeft(Math.max(navWidth - marginLeft, 0));
      }
    };
    onMainMarginLeft();
    window.addEventListener("resize", onMainMarginLeft);
    return () => window.removeEventListener("resize", onMainMarginLeft);
  }, [navRef.current, mainRef.current]);

  useEffect(() => {
    // Gives a warning that they will lose their progress if the user tries to leave/refresh the page
    const beforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, []);

  // Callback for select course in navigation drawer
  const onCourseClick = (course: Course) => {
    setCurrentCourse(course);
    window.history.pushState({}, "", `/app/${course.key}`);
  };

  // Callback for back arrow in top bar
  const onClickBack = () => {
    setCurrentCourse(null);
    window.history.pushState({}, "", "/app");
  };

  const onChangeAssessment = (assessment: Assessment, index: number) => {
    setCourses(
      courses.map((course) => {
        if (course.key === currentCourse?.key) {
          course.assessments[index] = assessment;
        }
        return course;
      })
    );
  };

  const deleteCurrentCourse = () => {
    setCourses(
      coursesRef.current.filter((course) => course.key !== currentCourse?.key)
    );
    setCurrentCourse(null);
    coursesRef.current = coursesRef.current.filter(
      (course) => course.key !== currentCourse?.key
    );
  };

  return (
    <>
      <nav
        className={classnames(
          "fixed top-0 left-0 w-full md:w-24 xl:w-[17rem] h-full bg-surface",
          currentCourse && "hidden", // For mobile
          "md:block z-20"
        )}
        ref={navRef}
      >
        <NavigationPanel
          courses={state}
          currentCourse={currentCourse}
          onCourseClick={onCourseClick}
          onCoursesChanged={onCoursesChanged}
        />
      </nav>
      {currentCourse && (
        <>
          <div className="z-10">
            <AppTopBar
              className="max-w-7xl mx-auto"
              style={{ paddingLeft: mainMarginLeft }}
            >
              {/* Icons */}
              <LeadingNavigation className="block md:hidden">
                <IconButton
                  className="text-on-surface"
                  icon="arrow_back"
                  onClick={onClickBack}
                />
              </LeadingNavigation>
              <TrailingIcon>
                <IconButton
                  className="text-on-surface-variant hidden md:block"
                  icon="error"
                />
                <IconButton
                  className="text-on-surface-variant hidden md:block"
                  icon="delete"
                  onClick={deleteCurrentCourse}
                />
                <IconButton
                  className="text-on-surface-variant block md:hidden"
                  icon="more_vert"
                />
              </TrailingIcon>

              {/* Titles */}
              <Title>
                {currentCourse.title} {currentCourse.number}
              </Title>
              <Subtitle>{currentCourse.topic}</Subtitle>
            </AppTopBar>
          </div>

          <main
            className={classnames(
              "max-w-7xl mx-auto relative",
              mainMarginLeft < 0 && "hidden"
            )}
            ref={mainRef}
            style={{ paddingLeft: mainMarginLeft }}
          >
            <div>
              <Button variant="filled" onClick={deleteOne}>
                Delete one
              </Button>
              {state.map((s, i) => (
                <p key={i}>{s.title}</p>
              ))}
            </div>
            <CoursePanel
              course={currentCourse}
              onChangeAssessment={onChangeAssessment}
            />
          </main>
        </>
      )}
    </>
  );
};

export default Review;
