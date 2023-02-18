import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import NavigationDrawer from "../../components/NavigationDrawer";
import AssessmentCard from "../../components/AssessmentCard";
import { classnames } from "../../Utilities";
import { Course, Courses, Assessment } from "../../logic/icsGen";
import Button from "../../components/Button";
import EditAssessment from "../../components/EditAssessment/EditAssessment";

import styles from "./Review.module.css";
import CourseInfo from "../../components/CourseInfo";
import AppTopBar from "../../components/AppTopBar";

const testState: Courses = [
  {
    code: "PSYC",
    number: 203,
    title: "Psychology",
    key: "psyc-203",
    topic: "Psychology of Everyday Life",
    assessments: [
      {
        name: "Identity Assignment",
        date: "2021-10-21T18:00:00.000",
        weight: "6%",
      },
      {
        name: "Coping Profile Assignment",
        date: "2021-10-29T18:00:00.000",
        weight: "2%",
      },
      {
        name: "Self-Reflection/Goal Setting Assignment",
        date: "2021-12-07T18:00:00.000",
        weight: "7%",
      },
      {
        name: "Experiential-Learning/Article-Evaluation Course Component",
        date: "2021-12-08T23:59:59.999",
        weight: "4%",
      },
      {
        name: "Exam 1",
        date: "2021-10-14T00:00:00.000",
        weight: "25%",
      },
      {
        name: "Exam 2",
        date: "2021-11-18T00:00:00.000",
        weight: "25%",
      },
      {
        name: "Exam 3/Final Exam",
        date: "",
        weight: "31%",
      },
    ],
  },
];

// Enum for the tabs
enum Tab {
  Assessments,
  Document,
}

const Review = () => {
  const { courseKey: courseKeyUrlParam } = useParams();

  const [selectedTab, setSelectedTab] = useState<Tab>(Tab.Assessments);
  const [courses, setCourses] = useState<Courses>(testState);
  const [currentCourseKey, setCurrentCourseKey] = useState<string | null>(null);
  const [editingAssessment, setEditingAssessment] = useState<{
    assessment: Assessment;
    index: number;
  } | null>(null);

  // At first render of the page, check if the course key is valid
  // and assign value to current course key
  useEffect(() => {
    if (
      courseKeyUrlParam === undefined ||
      courseKeyLookup[courseKeyUrlParam] === undefined
    ) {
      setCurrentCourseKey(null);
    } else {
      setCurrentCourseKey(courseKeyUrlParam);
    }
  }, []);

  useEffect(() => {
    setEditingAssessment(null);
  }, [currentCourseKey]);

  // Callback for when the courses are changed
  const onCoursesChanged = (newCourses: Courses) => {
    const existingCourseKeys = courses.map((course) => course.key);
    for (const course of newCourses) {
      // Numbering undetermined courses
      if (!course.code || !course.number) {
        course.code = "Course";
        course.number = Object.values(courses).length + 1;
        course.title = "Course";
      }

      // Generate course key
      const key = `${course.code}-${course.number}`.toLowerCase();
      if (existingCourseKeys.includes(key)) continue;

      course.key = key;
      courses.push(course);
      existingCourseKeys.push(key);
    }

    setCourses([...courses]);
  };

  // Memoize the course key lookup in format of { [key]: course } for performance
  const courseKeyLookup = useMemo(
    () =>
      Object.fromEntries(
        courses.map((course) => [course.key, course])
      ) as Record<string, Course>,
    [courses]
  );

  // Memoize the course based on the course key
  const currentCourse = useMemo(
    () =>
      currentCourseKey && currentCourseKey in courseKeyLookup
        ? courseKeyLookup[currentCourseKey]
        : null,
    [currentCourseKey, courseKeyLookup[currentCourseKey || ""]]
  );

  const onCourseClick = (course: Course | null) => {
    if (course === null) {
      setCurrentCourseKey(null);
      setTimeout(() => history.pushState(null, "", "/app"), 10);
    } else {
      setCurrentCourseKey(course.key);
      setTimeout(() => history.pushState(null, "", `/app/${course.key}`), 100);
    }
  };

  return (
    <div className="flex flex-row justify-between">
      <nav
        className={classnames(
          "md:w-64",
          "w-full",
          "flex-shrink-0",
          currentCourseKey && "hidden",
          "md:block"
        )}
      >
        <NavigationDrawer
          courses={courses}
          currentCourse={currentCourse}
          onCoursesChanged={onCoursesChanged}
          onCourseClick={onCourseClick}
        />
      </nav>
      {currentCourse && (
        <main
          className={classnames("flex-shrink-0 w-full text-left", styles.main)}
        >
          <header className="w-full p-4 text-xl">
            <AppTopBar courseId={currentCourse.key} description={currentCourse.topic}/>
          </header>
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:hidden flex flex-row">
              <button
                className={classnames(
                  "w-full bg-gray-300 p-2",
                  selectedTab === Tab.Assessments && "bg-red-500"
                )}
                onClick={() => setSelectedTab(0)}
              >
                Assessments
              </button>
              <button
                className={classnames(
                  "w-full bg-gray-300 p-2",
                  selectedTab === Tab.Document && "bg-red-500"
                )}
                onClick={() => setSelectedTab(1)}
              >
                Document
              </button>
            </div>
            <section
              className={classnames(
                "w-full",
                "md:w-1/2",
                "p-4",
                "h-screen",
                selectedTab === Tab.Document && "hidden md:block"
              )}
            >
              {editingAssessment === null ? (
                <>
                  <CourseInfo
                    hours="H(3-2T)"
                    department="Computer Science"
                    description="This course is an introduction to the design and analysis of algorithms. Topics include: algorithmic problem solving, algorithmic efficiency, sorting and searching, divide-and-conquer, greedy algorithms, dynamic programming, and graph algorithms. Prerequisite: CSE 143 or equivalent."
                  />
                  <div
                    className={classnames(
                      "w-full",
                      "flex flex-row",
                      "justify-between",
                      "items-center",
                      "mb-3"
                    )}
                  >
                    <h1 className={classnames("text-sys-primary", "font-bold")}>
                      ASSESSMENTS
                    </h1>
                    <Button
                      variant="filled"
                      className={classnames("px-5", "py-2")}
                    >
                      <span
                        className={classnames(
                          "material-symbols-outlined",
                          "text-4xl"
                        )}
                      >
                        add
                      </span>
                    </Button>
                  </div>
                  <ul className="flex flex-col">
                    {currentCourse.assessments.map((assessment, index) => (
                      <AssessmentCard
                        key={index}
                        assessment={assessment}
                        onAssessmentClick={() => {
                          setEditingAssessment({ assessment, index });
                        }}
                      />
                    ))}
                  </ul>
                </>
              ) : (
                <EditAssessment
                  assessment={editingAssessment.assessment}
                  onClose={() => setEditingAssessment(null)}
                  onSave={(newAssessment: Assessment) => {
                    setCourses(
                      courses.map((course) => {
                        if (course.key === currentCourseKey) {
                          course.assessments[editingAssessment.index] =
                            newAssessment;
                        }
                        return course;
                      })
                    );
                    setEditingAssessment(null);
                  }}
                />
              )}
            </section>
            <section
              className={classnames(
                "w-full",
                "md:w-1/2",
                "p-4",
                "h-screen",
                selectedTab === Tab.Assessments && "hidden md:block"
              )}
            >
              <img
                src="../pdf.png"
                alt="the pdf viewer"
                className={classnames(
                  "border-x",
                  "border-y",
                  "border-dashed",
                  "border-gray-400",
                  "rounded-3xl",
                  "w-full",
                  "mt-2"
                )}
              />
            </section>
          </div>
        </main>
      )}
      <div className="w-64"></div>
    </div>
  );
};

export default Review;
