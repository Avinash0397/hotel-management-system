package com.booking.booking_service.controller;

import com.booking.booking_service.entity.Coupon;
import com.booking.booking_service.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    @PostMapping
    @PreAuthorize("hasRole('MANAGER')")
    public Coupon createCoupon(@RequestBody Coupon coupon) {
        return couponService.createCoupon(coupon);
    }

    @GetMapping
    public List<Coupon> getAllCoupons() {
        return couponService.getAllCoupons();
    }

    @PostMapping("/validate")
    public Map<String, Object> validateCoupon(@RequestBody Map<String, Object> body) {
        String code = (String) body.get("code");
        Double amount = Double.valueOf(body.get("amount").toString());
        return couponService.validateCoupon(code, amount);
    }

    @PostMapping("/apply/{couponId}")
    public Coupon applyCoupon(@PathVariable UUID couponId) {
        return couponService.applyCoupon(couponId);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public String deleteCoupon(@PathVariable UUID id) {
        couponService.deleteCoupon(id);
        return "Coupon deleted";
    }
}
