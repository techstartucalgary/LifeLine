import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import NavigationDrawer from "../../components/NavigationDrawer";
import AssessmentCard from "../../components/AssessmentCard";
import { classnames } from "../../Utilities";
import { Courses } from "../../logic/icsGen";
import styles from "./Review.module.css";
import Button from "../../components/Button";
import CourseInfo from "../../components/CourseInfo";

const testState: Courses = {
  "PSYC 203": {
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
};

const Review = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [courses, setCourses] = useState<Courses>(testState);
  const displayFormat = (course: string) =>
    course.replace(/-/g, " ").toUpperCase();

  let { courseId } = useParams();
  courseId = courseId ? displayFormat(courseId) : undefined;

  const onCoursesChanged = (newCourses: Courses) => {
    setCourses({ ...courses, ...newCourses });
  };

  return (
    <div className="flex flex-row justify-between">
      <nav
        className={classnames(
          "md:w-64",
          "w-full",
          "flex-shrink-0",
          courseId && "hidden",
          "md:block"
        )}
      >
        <NavigationDrawer
          courses={courses}
          currentCourseKeyString={courseId}
          onCoursesChanged={onCoursesChanged}
        />
      </nav>
      {courseId && (
        <main
          className={classnames(
            "flex-shrink-0 text-center w-full",
            styles.main
          )}
        >
          <header className=" w-full p-4 text-left">
            <Link to="/review">
              <span
                className={classnames("material-icons", "md:hidden", "inline")}
                style={{ fontSize: "1.5rem", verticalAlign: "middle" }}
              >
                arrow_back
              </span>
            </Link>
            <h1 className="text-2xl font-bold">{courseId && displayFormat(courseId)}</h1>
            <h2 className="text-lg">{courses[courseId]?.topic}</h2>
          </header>
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:hidden flex flex-row">
              <button
                className={`w-full bg-gray-300 p-2 ${
                  selectedTab === 0 && "bg-red-500"
                }`}
                onClick={() => setSelectedTab(0)}
              >
                Assessments
              </button>
              <button
                className={`w-full bg-gray-300 p-2 ${
                  selectedTab === 1 && "bg-red-500"
                }`}
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
                selectedTab === 1 && "hidden md:block",
                "text-left"
              )}
            >
              <CourseInfo />
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
                <Button variant="filled" className={classnames("px-5", "py-2")}>
                  <span className={classnames("material-icons", "text-4xl")}>
                    add
                  </span>
                </Button>
              </div>
              <ul className="flex flex-col">
                {courses[courseId]?.assessments.map((assessment) => (
                  <AssessmentCard
                    key={assessment.name + assessment.date + assessment.weight} // should be assessment.source eventually
                    assessment={assessment}
                    onAssessmentClick={() => {
                      console.log("clicked");
                    }}
                  />
                ))}
              </ul>
            </section>
            <section
              className={classnames(
                "w-full",
                "md:w-1/2",
                "p-4",
                "h-screen",
                selectedTab === 0 && "hidden md:block"
              )}
            >
              <img
                src="../pdf.png"
                alt="the pdf viewer"
                className={classnames(
                  // dashed border with radius
                  // thin border
                  // very small dashes
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
