from fpdf import FPDF


class PDF(FPDF):

    def __init__(self, orientation, unit, format, margins):
        super().__init__(orientation=orientation, unit=unit, format=format)
        self.add_font("Arial", fname="utils/fonts/ArialNarrow2.ttf")
        self.add_font("ArialB", fname="utils/fonts/arial_bold.ttf")

        self.set_font("ArialB", size=12)
        self.set_margins(*margins)

    def header(self):
        if self.page_no() == 1:
            
            self.set_font("ArialB", size=12)

            self.cell(w=self.epw, h=5, txt="Technological Institute of the Philippines", border="LTRB", new_x="LMARGIN", new_y="NEXT", align="C")
            self.cell(w=self.epw, h=5, txt="Computer Engineering Department", border="L RB", new_x="LMARGIN", new_y="NEXT", align="C")
            self.cell(w=self.epw, h=5, txt="Quezon City Campus", border="LRB", new_x="LMARGIN", new_y="NEXT", align="C")

            self.cell(w=self.get_string_width("  Semester:")+1, h=5, txt="  Semester:", border="LB", new_x="RIGHT")
            self.set_font("Arial", size=17)
            self.cell(w=self.get_string_width("□")+1, h=5, txt="□", border="B", new_x="RIGHT")
            self.set_font("ArialB", size=12)
            self.cell(w=self.get_string_width("1")+1, h=5, txt="1", border="B", new_x="RIGHT")
            self.set_font("Arial", size=17)
            self.cell(w=self.get_string_width("□")+1, h=5, txt="□", border="B", new_x="RIGHT")
            self.set_font("ArialB", size=12)
            self.cell(w=self.get_string_width("2")+1, h=5, txt="2", border="B", new_x="RIGHT")
            self.set_font("Arial", size=17)
            self.cell(w=self.get_string_width("□")+1, h=5, txt="□", border="B", new_x="RIGHT")
            self.set_font("ArialB", size=12)
            self.cell(w=self.get_string_width("Summer")+2, h=5, txt="Summer", border="B", new_x="RIGHT")
            self.cell(w=self.get_string_width("—")+2, h=5, txt="—", border="B", new_x="RIGHT")
            self.cell(w=self.get_string_width("School Year: 20__ - 20__")+30, h=5, txt="School Year: 20__ - 20__", border="B", new_x="RIGHT")
            self.set_font("Arial", size=17)
            self.cell(w=self.get_string_width("□")+1, h=5, txt="□", border="LB", new_x="RIGHT")
            self.set_font("ArialB", size=12)
            self.cell(w=self.get_string_width("Quiz")+1, h=5, txt="Quiz", border="B", new_x="RIGHT")
            self.set_font("Arial", size=17)
            self.cell(w=self.get_string_width("□")+1, h=5, txt="□", border="B", new_x="RIGHT")
            self.set_font("ArialB", size=12)
            self.cell(w=self.get_string_width("Exam")+11.5, h=5, txt="Exam", border="RB", new_x="LMARGIN", new_y="NEXT")
            self.cell(w=32, h=5, txt="  Name:", border="LRB", new_x="RIGHT")
            self.cell(w=74.5, h=5, txt="", border="B", new_x="RIGHT")
            self.cell(w=25, h=5, txt="  Date:", border="LRB", new_x="RIGHT")
            self.cell(w=38.5, h=5, txt="", border="BR", new_x="LMARGIN", new_y="NEXT")
            self.cell(w=32, h=5, txt="  Course/Section:", border="LRB", new_x="RIGHT")
            self.cell(w=74.5, h=5, txt="", border="B", new_x="RIGHT")
            self.cell(w=25, h=5, txt="  Instructor:", border="LRB", new_x="RIGHT")
            self.cell(w=38.5, h=5, txt="", border="BR", new_x="LMARGIN", new_y="NEXT")
            self.ln(5)

    def print_questions(self, questions, teacher_copy):
        for index, question in enumerate(questions):
            question_text = question['question_text'].strip()
            if teacher_copy:
                self.set_text_color(34, 139, 34)
                question_text += f" ({question['score']} point(s))"
                self.set_text_color(0, 0, 0)
            self.multi_cell(w=self.epw, h=6, txt=f"{index+1}. {question_text}", new_x="LMARGIN", new_y="NEXT")
            if question["image"]:
                self.cell(w=6, h=None, new_x="RIGHT")
                self.image(question["image"], h=40)
                self.ln(2)
                
            self.print_answers(question["answers"], teacher_copy, question["question_type"])
            self.ln(2)

    def print_multiple_choice_answers(self, answers, teacher_copy):
        column_widths = {}
        n = len(answers)

        while n > 0:
            column_widths[self.epw/n - 4] = n
            n//=2

        max_column_width = self.epw/len(answers) - 4
        
        
        for answer in answers:

            widths = list(column_widths.keys())
            widths.sort()

            # do binary search
            i = 0
            j = len(widths) - 1

            target = self.get_string_width(answer["answer_text"]) + 30

            while i < j:
                m = (i+j)//2

                if widths[m] == target:
                    i = m
                    break
                elif widths[m] > target:
                    j = m - 1
                else:
                    i = m + 1
            
            i = i if target <= widths[i] else i + 1

            max_column_width = widths[i] if i < len(widths) else widths[i-1]

  
        for index, answer in enumerate(answers):
            self.cell(w=4, h=None, txt="", new_x="RIGHT")
            new_x  = "RIGHT" if (index+1) % column_widths[max_column_width] != 0 else "LMARGIN"
            new_y  = "TOP" if (index+1) % column_widths[max_column_width] != 0 else "NEXT"
            if teacher_copy and answer["is_correct"]:
                self.set_text_color(255, 0, 0)
            self.multi_cell(w=max_column_width, h=6, txt=f"{chr(ord('a')+index)}. {self.normalize_text(answer['answer_text'])}", new_x =new_x, new_y=new_y )
            self.set_text_color(0, 0, 0)
            if (index+1) % column_widths[max_column_width] == 0:
                self.ln(2)



    def print_enumeration_answers(self, answers, teacher_copy):
        if teacher_copy:
            self.set_font("ArialB",  size=11)
            self.multi_cell(self.epw, 6, "Answers:", align="L")
            self.ln(0)
            self.set_font("Arial", size=11)
          
            for answer in answers:
                self.cell(w=10, h=7, txt=f"    ▪", new_x="RIGHT")
                self.set_text_color(255, 0, 0)
                answer_text = f"{self.normalize_text(answer['answer_text'])}"
                self.multi_cell(self.epw-14, 7, answer_text, border="B")
                self.set_text_color(0,0,0)
                self.ln(0)
        else:
            for _ in range(len(answers)):
                self.cell(w=10, h=7, txt=f"    ▪", new_x="RIGHT")
                self.multi_cell(self.epw-14, 7, "", border="B")
                self.ln(0)

    def print_essay_answers(self, answers, teacher_copy):
        if teacher_copy:
            self.set_font("Arial", style="B")
            self.multi_cell(self.epw-14, 8, "Answer:", align="L")
            self.ln(0)
            self.set_font("Arial", style="")
            for answer in answers:
                self.cell(w=10, h=7, txt=f"", new_x="RIGHT")
                answer_text = f"   {self.normalize_text(answer['answer_text'])}"
                self.multi_cell(self.epw-14, 8, answer_text, border=1)
                self.ln(0)
        else:
            for _ in range(len(answers)):
                self.cell(w=10, h=7, txt=f"", new_x="RIGHT")
                self.multi_cell(self.epw-14, 40, "", border=1)
                self.ln(0)


    def print_answers(self, answers, teacher_copy, question_type):
        if question_type == "multiple_choice" or question_type == "true_or_false":
            self.print_multiple_choice_answers(answers, teacher_copy)
        elif question_type == "enumeration":
            self.print_enumeration_answers(answers, teacher_copy) 
        elif question_type == "essay":
            self.print_essay_answers(answers, teacher_copy)
       
