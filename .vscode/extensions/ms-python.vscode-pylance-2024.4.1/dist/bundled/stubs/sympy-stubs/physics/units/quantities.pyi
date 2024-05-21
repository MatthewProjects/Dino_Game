from typing import Any, Self
from sympy.core.add import Add
from sympy.core.expr import AtomicExpr, Expr
from sympy.physics.units.dimensions import Dimension

class Quantity(AtomicExpr):
    is_commutative = ...
    is_real = ...
    is_number = ...
    is_nonzero = ...
    is_physical_constant = ...
    _diff_wrt = ...
    def __new__(cls, name, abbrev=..., latex_repr=..., pretty_unicode_repr=..., pretty_ascii_repr=..., mathml_presentation_repr=..., is_prefixed=..., **assumptions) -> Self:
        ...
    
    def set_global_dimension(self, dimension) -> None:
        ...
    
    def set_global_relative_scale_factor(self, scale_factor, reference_quantity) -> None:
        ...
    
    @property
    def name(self):
        ...
    
    @property
    def dimension(self) -> Expr | Dimension:
        ...
    
    @property
    def abbrev(self):
        ...
    
    @property
    def scale_factor(self):
        ...
    
    def convert_to(self, other, unit_system=...) -> Add | Quantity:
        ...
    
    @property
    def free_symbols(self) -> set[Any]:
        ...
    
    @property
    def is_prefixed(self) -> bool:
        ...
    


class PhysicalConstant(Quantity):
    is_physical_constant = ...

