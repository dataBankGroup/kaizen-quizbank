from fpdf import FPDF

class MultiColumnPDF(FPDF):

	def __init__(self, orientation="P", columns=1, col_margin=5, title=None) -> None:
		self.columns = columns
		self.col_margin = col_margin
		self.col = 0
		self.y0 = 0
		self.title = title
		# effective page width (epw) only accessible 
		# after being initialized as FPDF
		super().__init__(orientation=orientation, unit="mm")
		self.add_font("DejaVu", fname="utils/fonts/DejaVuSerifCondensed.ttf")
		self.add_font("Arial", fname="utils/fonts/ArialNarrow2.ttf")
		self.add_font("ArialB", fname="utils/fonts/arial_bold.ttf")
		self.col_width = self.epw / self.columns
		

	def header(self):
		if self.page_no() == 1:
			self.set_font("ArialB", size=12)
			self.cell(0, 8, "Technological Institute of the Philippines", 1, 1, align="C")
			self.cell(0, 8, "Computer Engineering Department", 1, 1, align="C")
			self.cell(0, 8, "Quezon City Campus", 1, 1, align="C")
			self.ln(0)

			self.set_font("Arial", style="", size=12)
			self.multi_cell(18, 8, "Semester:", border="L", ln=3)
			self.set_font("Arial", style="", size=17)
			self.multi_cell(6, 8, "□", "T",  ln=3)
			self.set_font("Arial", style="", size=12)
			self.multi_cell(4, 8, "1", ln=3)
			self.set_font("Arial", style="", size=17)
			self.multi_cell(6, 8, "□", "T",  ln=3)
			self.set_font("Arial", style="", size=12)
			self.multi_cell(4, 8, "2", ln=3)
			self.set_font("Arial", style="", size=17)
			self.multi_cell(6, 8, "□", "T",  ln=3)
			self.set_font("Arial", style="", size=12)
			self.multi_cell(17, 8, "Summer", ln=3)
			self.multi_cell(89, 8, "School Year: 20___ - 20___", border="R", ln=3)
			self.set_font("Arial", style="", size=17)
			self.multi_cell(8, 8, " □", "T", ln=3)
			self.set_font("Arial", style="", size=12)
			self.multi_cell(12, 8, "Quiz", ln=3)
			self.set_font("Arial", style="", size=17)
			self.multi_cell(6, 8, "□", "T",  ln=3)
			self.set_font("Arial", style="", size=12)
			self.multi_cell(0, 8, "Exam", border="R")
			self.ln(0)
			self.multi_cell(30, 8, " Name", 1, ln=3)
			self.multi_cell(100, 8, "", 1, ln=3)
			self.multi_cell(20, 8, " Date", 1, ln=3)
			self.multi_cell(0, 8, "", 1)
			self.ln(0)
			self.multi_cell(30, 8, " Course/Section", 1, ln=3)
			self.multi_cell(100, 8, "", 1, ln=3)
			self.multi_cell(20, 8, " Instructor", 1, ln=3)
			self.multi_cell(0, 8, "", 1)
			self.ln(10)
			self.y0 = self.get_y()


	@property
	def accept_page_break(self):
		# Store previous column to check later if a new page is needed
		self.col = (self.col + 1) % self.columns	
		previous_column = self.col
		self.next_column()
		return previous_column >= self.columns - 1
	
	# Advance to the next column, reset the y position, and 
	# set the left margin to the next column's position
	def next_column(self):
		self.col = (self.col + 1) % self.columns
		self.set_y(self.y0)
		x = (self.col * self.col_width) + self.col_margin
		self.set_left_margin(x)
		self.set_x(x)
